import { useEffect, useState, type ReactNode } from 'react';
import { hasInput, loadData, type DataSource } from './data';
import { Player } from './Player';
import type { Trace, TraceFn, VizProps } from './types';
import { useStepper } from './useStepper';

interface DayVizProps<F> extends VizProps {
  trace: TraceFn<F>;
  render: (frame: F, trace: Trace<F>, index: number) => ReactNode;
  /** One line explaining what is shown */
  caption: string;
  fps?: number;
}

type State<F> = { key: string } & (
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; trace: Trace<F>; ms: number }
);

/** Common shell: data source switch, trace computation, player and answer. */
export function DayViz<F>({ year, day, part, trace, render, caption, fps }: DayVizProps<F>) {
  const [source, setSource] = useState<DataSource>('example');
  const key = `${year}-${day}-${part}-${source}`;
  const [computed, setState] = useState<State<F>>({ key: '', status: 'loading' });
  // A result computed for another day, part or source is never shown with this one's renderer
  const state: State<F> = computed.key === key ? computed : { key, status: 'loading' };
  const inputAvailable = hasInput(year, day);

  useEffect(() => {
    let cancelled = false;
    loadData(year, day, part, source)
      .then(
        (text) =>
          new Promise<State<F>>((done) =>
            // Let the loading state paint before a potentially heavy computation
            setTimeout(() => {
              const start = performance.now();
              try {
                done({
                  key,
                  status: 'ready',
                  trace: trace(text, part),
                  ms: performance.now() - start
                });
              } catch (error) {
                done({ key, status: 'error', message: String(error) });
              }
            }, 30)
          )
      )
      .catch((error) => ({ key, status: 'error', message: String(error) }) as State<F>)
      .then((next) => {
        if (!cancelled) setState(next);
      });
    return () => {
      cancelled = true;
    };
  }, [key, year, day, part, source, trace]);

  const select = (next: DataSource) => setSource(next);

  const tab = (value: DataSource, label: string) => (
    <button
      role="tab"
      aria-selected={source === value}
      onClick={() => select(value)}
      className={`px-3 py-1 rounded-md text-sm transition-colors ${
        source === value
          ? 'bg-bg-highlight text-text-primary'
          : 'text-text-secondary hover:text-text-primary'
      }`}
    >
      {label}
    </button>
  );

  return (
    <section className="bg-bg-panel rounded-2xl p-4 sm:p-6 space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-lg font-normal flex items-center gap-3">
          <span className="neon-rule !w-4" aria-hidden="true" />
          Visualization
        </h3>
        <div className="inline-flex rounded-lg bg-bg-dark p-1" role="tablist" aria-label="Data">
          {tab('example', 'Example')}
          {inputAvailable && tab('input', 'Input')}
        </div>
      </div>
      <p className="text-sm text-text-secondary max-w-[75ch]">{caption}</p>

      {state.status === 'loading' && (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-grid-line border-t-accent-blue" />
        </div>
      )}
      {state.status === 'error' && <p className="text-accent-red text-sm">{state.message}</p>}
      {state.status === 'ready' && (
        <Stepped key={key} trace={state.trace} render={render} fps={fps} ms={state.ms} />
      )}
    </section>
  );
}

function Stepped<F>({
  trace,
  render,
  fps,
  ms
}: {
  trace: Trace<F>;
  render: DayVizProps<F>['render'];
  fps?: number;
  ms: number;
}) {
  const stepper = useStepper(trace.frames.length, fps);
  const frame = trace.frames[stepper.index];
  const done = stepper.index === trace.frames.length - 1;

  return (
    <div className="space-y-4">
      <Player stepper={stepper} count={trace.frames.length} />
      {frame !== undefined && render(frame, trace, stepper.index)}
      <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
        <span>
          <span className="text-text-secondary">Answer: </span>
          <span
            className={`font-medium tabular-nums ${done ? 'text-accent-gold' : 'text-text-secondary'}`}
          >
            {String(trace.answer)}
          </span>
        </span>
        <span className="text-xs text-text-secondary">computed in {ms.toFixed(0)} ms</span>
      </div>
    </div>
  );
}

/** Small label/value pill for per-frame stats */
export function Stat({ label, value, color }: { label: string; value: ReactNode; color?: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5 rounded-md bg-bg-dark px-2.5 py-1 text-sm">
      <span className="text-text-secondary">{label}</span>
      <span className="font-medium tabular-nums" style={{ color }}>
        {value}
      </span>
    </span>
  );
}

export function Stats({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}
