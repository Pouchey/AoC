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

type State<F> =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; trace: Trace<F>; ms: number };

/** Common shell: data source switch, trace computation, player and answer. */
export function DayViz<F>({ year, day, part, trace, render, caption, fps }: DayVizProps<F>) {
  const [source, setSource] = useState<DataSource>('example');
  const [state, setState] = useState<State<F>>({ status: 'loading' });
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
                done({ status: 'ready', trace: trace(text, part), ms: performance.now() - start });
              } catch (error) {
                done({ status: 'error', message: String(error) });
              }
            }, 30)
          )
      )
      .catch((error) => ({ status: 'error', message: String(error) }) as State<F>)
      .then((next) => {
        if (!cancelled) setState(next);
      });
    return () => {
      cancelled = true;
    };
  }, [year, day, part, source, trace]);

  const select = (next: DataSource) => {
    if (next === source) return;
    setState({ status: 'loading' });
    setSource(next);
  };

  const tab = (value: DataSource, label: string) => (
    <button
      onClick={() => select(value)}
      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
        source === value
          ? 'bg-accent-blue text-white'
          : 'bg-bg-panel text-text-secondary hover:text-text-primary border border-grid-line'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-bg-highlight rounded-xl p-4 sm:p-6 border border-grid-line space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-2">
          <span className="w-1 h-3 bg-accent-green rounded-full" />
          Visualization
        </h4>
        <div className="flex gap-2">
          {tab('example', 'Example')}
          {inputAvailable && tab('input', 'Input')}
        </div>
      </div>
      <p className="text-sm text-text-secondary">{caption}</p>

      {state.status === 'loading' && (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-blue" />
        </div>
      )}
      {state.status === 'error' && <p className="text-accent-red text-sm">{state.message}</p>}
      {state.status === 'ready' && (
        <Stepped key={`${source}`} trace={state.trace} render={render} fps={fps} ms={state.ms} />
      )}
    </div>
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
            className={`font-mono font-semibold ${done ? 'text-accent-gold' : 'text-text-secondary'}`}
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
    <span className="inline-flex items-baseline gap-1.5 rounded-md bg-bg-panel border border-grid-line px-2.5 py-1 text-sm">
      <span className="text-text-secondary">{label}</span>
      <span className="font-mono font-semibold" style={{ color }}>
        {value}
      </span>
    </span>
  );
}

export function Stats({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}
