import { E, f, O, T, TE } from './deps.ts';

// -------------------------------------------------------------------------------------
// model - Booster
// -------------------------------------------------------------------------------------

// framework-types / typelevel
interface Class<TReflected> {
  // deno-lint-ignore no-explicit-any
  new (...args: any[]): TReflected;
}

type ReadOnlyNonEmptyArray<TElement> = {
  readonly 0: TElement;
} & ReadonlyArray<TElement>;

// framework-types / sequence-metadata
interface SequenceKey {
  name: string;
  value: string;
}

// framework-types / entity
interface EntityInterface {
  id: string;
}

// framework-types / events
interface EventInterface {
  entityID(): string;
}

// framework-types / readmodel
interface ReadModelInterface {
  id: string;
  boosterMetadata?: {
    version: number;
    schemaVersion: number;
    optimisticConcurrencyValue?: string | number;
  };
  // deno-lint-ignore no-explicit-any
  [key: string]: any;
}

// framework-types / register
interface Register {
  events: (...events: Array<EventInterface>) => Register;
}

// framework-core / booster
type BoosterEntityMethod = <TEntity extends EntityInterface>(
  entityClass: Class<TEntity>,
  entityID: string,
) => Promise<TEntity | undefined>;

// framework-core / booster
type BoosterReadModelMethod = <TReadModel extends ReadModelInterface>(
  readModelClass: Class<TReadModel>,
) => SearcherFindByIdMethod<TReadModel>;

// framework-types / searcher
interface SearcherFindByIdMethod<TReadModel> {
  findById: (
    id: string,
    sequenceKey?: SequenceKey,
  ) => Promise<TReadModel | ReadOnlyNonEmptyArray<TReadModel>>;
}

// -------------------------------------------------------------------------------------
// instance
// -------------------------------------------------------------------------------------

/**
 * fp-ts wrapper for `Booster.entity`
 *
 * @remarks
 * Either.left (aka. Error) if `Booster.entity` fails.
 * If no result was found it returns Either.right(O.none)
 *
 * @example
 *
 * ```ts
 * import { Booster } from '@boostercloud/framework-core'
 * fromEntityPromise(Booster.entity(EntityX, '123'))
 * ```
 */
export const fromEntityPromise = <T extends EntityInterface>(
  entityPromise: ReturnType<BoosterEntityMethod>,
): TE.TaskEither<Error, O.Option<T>> => {
  return TE.tryCatch(
    () => entityPromise.then(O.fromNullable).catch(Promise.reject),
    E.toError,
  ) as TE.TaskEither<Error, O.Option<T>>;
};

/**
 * Stand-in for `Booster.entity`
 *
 * @remarks
 *
 * Either.left (aka. Error) if `Booster.entity` fails.
 * If no result was found it returns Either.right(O.none)
 *
 * @example
 *
 * ```ts
 * entity(EntityX, '123') // equal to `fromEntityPromise(Booster.entity(EntityX, '123'))`
 * ```
 */
export const entity = (Booster: { entity: BoosterEntityMethod }) =>
<T extends EntityInterface>(
  Entity: Class<T>,
  uuid: string,
): TE.TaskEither<Error, O.Option<T>> => {
  return fromEntityPromise(Booster.entity(Entity, uuid));
};

/**
 * Stand-in for `Booster.readModel(X).findById(uuis)`
 *
 * @remarks
 * Either.left (aka. Error) if `Booster.readModel.findById` fails.
 * If no result was found it returns Either.right(O.none)
 */
export const readModel = (Booster: { readModel: BoosterReadModelMethod }) =>
<T extends ReadModelInterface>(
  ReadModel: Class<T>,
  uuid: string,
): TE.TaskEither<Error, O.Option<T>> => {
  return TE.tryCatch(
    () =>
      Booster.readModel(ReadModel).findById(uuid)
        .then((x) => {
          // it is not clear if this is a non-empty array of just an object
          // so we account for both here. Needs to be clarified with booster
          // as the findById return type is ambiguous
          if (x instanceof Array) {
            return O.fromNullable(x[0]);
          } else if (x instanceof Object) {
            return O.fromNullable(x);
          }
          return O.none;
        })
        .catch(Promise.reject),
    E.toError,
  ) as TE.TaskEither<Error, O.Option<T>>;
};

/**
 * _TODO_: Someone other than me please turn this into a decorator lol - it's too late here for me to wrap my head around method decorators
 *
 * @example
 *
 * ```ts
 * @Command({ authorize: 'all })
 * export class Command {
 *
 * public static async handle (command: Command, register: Register): Promise<void> {
 *   return await handle(Command.main(command), register)()
 * }
 *
 * public static main (command: Command): TE.TaskEither<Error, Event[]> {
 *   return f.pipe(...)
 * }
 * ```
 */
export const handle = <E, IEvent extends EventInterface>(
  main: TE.TaskEither<E, IEvent[]>,
  register: Register,
): T.Task<void> => {
  return f.pipe(
    main,
    TE.matchW(
      (left: E) => {
        throw (left instanceof Error) ? left : Error(String(left));
      },
      (events) => {
        register.events(...events);
      },
    ),
  );
};
