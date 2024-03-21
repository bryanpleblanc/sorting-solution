"use strict";
const { insert, extractMin } = require("./heap");

/**
Logs printed:            24118
Time taken (s):          0.853
Logs/s:                  28274.325908558032
***********************************
 * Longer to build more complex
 * Only slightly faster at this scale
 * More memory efficient
 */
function syncSolutionHeap(logSources, printer) {
  const heap = [];

  // Initial population of the heap with the first log entry from each log source
  logSources.forEach((source, index) => {
    const firstEntry = source.pop();
    if (firstEntry) {
      insert(heap, { entry: firstEntry, index });
    }
  });

  // Continuously process the smallest entry and fetch the next one from the same log source
  while (heap.length > 0) {
    const { entry, index } = extractMin(heap);
    printer.print(entry);
    const nextEntry = logSources[index].pop();
    if (nextEntry) {
      insert(heap, { entry: nextEntry, index });
    }
  }

  printer.done();
}

module.exports = (logSources, printer) => {
  console.log("Starting sync sort...");
  syncSolutionHeap(logSources, printer);
  console.log("Sync sort complete.");
};
