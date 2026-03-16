function OutputPanel({ output }) {
  return (
    <div className="h-full bg-base-100 flex flex-col">
      <div className="px-4 py-2 bg-base-200 border-b border-base-300 font-semibold text-sm">
        Output
      </div>
      <div className="flex-1 overflow-auto p-4">
        {output === null ? (
          <p className="text-base-content/50 text-sm">
            Click "Run Code" to see the output here...
          </p>
        ) : output.success ? (
          <div>
            {output.output ? (
              <pre className="text-sm font-mono text-success whitespace-pre-wrap">
                {output.output}
              </pre>
            ) : (
              <p className="text-base-content/50 text-sm">No output</p>
            )}
            {/* show stderr as warning even on success */}
            {output.stderr && (
              <pre className="text-sm font-mono text-warning whitespace-pre-wrap mt-2">
                {output.stderr}
              </pre>
            )}
          </div>
        ) : (
          <div>
            {output.output && (
              <pre className="text-sm font-mono text-base-content whitespace-pre-wrap mb-2">
                {output.output}
              </pre>
            )}
            <pre className="text-sm font-mono text-error whitespace-pre-wrap">
              {output.error}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default OutputPanel;