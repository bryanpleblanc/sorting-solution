"use strict";
const { insert, extractMin } = require("./heap");

async function asyncSolutionHeapOptimized(logSources, printer) {
  const heap = [];
  let activeSources = logSources.filter((source) => !source.drained);

  // Populate the heap with the first entry from each active log source.
  // This operation is done in parallel for all active sources.
  await Promise.all(
    activeSources.map(async (source, index) => {
      const entry = await source.popAsync();
      if (entry) {
        insert(heap, { entry, index });
      } else {
        source.drained = true;
      }
    })
  );

  while (heap.length > 0) {
    const { entry, index } = extractMin(heap);
    printer.print(entry);

    // Initiate fetching the next entry from each active source in parallel.
    const fetchPromises = activeSources.map(async (source) => {
      if (!source.drained) {
        const nextEntry = await source.popAsync();
        if (nextEntry) {
          insert(heap, {
            entry: nextEntry,
            index: activeSources.indexOf(source),
          });
        } else {
          source.drained = true;
        }
      }
    });

    // Wait for all fetch operations to complete before proceeding.
    await Promise.all(fetchPromises.filter((p) => p !== undefined));

    activeSources = activeSources.filter((source) => !source.drained);
  }

  printer.done();
}

/**
 * Logs printed:            24523
 * Time taken (s):          106.345
 * Logs/s:                  230.59852367295125
 ***********************************
 * Longer to build more complex
 * Only slightly faster at this scale
 * More memory efficient
 */
async function asyncSolutionHeap(logSources, printer) {
  const heap = [];

  // Initial population of the heap with the first log entry from each log source
  for (let i = 0; i < logSources.length; i++) {
    const firstEntry = await logSources[i].popAsync();
    if (firstEntry) {
      insert(heap, { entry: firstEntry, index: i });
    }
  }

  // Continuously process the smallest entry and fetch the next one from the same log source
  while (heap.length > 0) {
    const { entry, index } = extractMin(heap);
    printer.print(entry);
    const nextEntry = await logSources[index].popAsync();
    if (nextEntry) {
      insert(heap, { entry: nextEntry, index });
    }
  }

  printer.done();
}

/*
 * Logs printed:            24504
 * Time taken (s):          107.302
 * Logs/s:                  228.36480214721067
 ***********************************
 * Easier/ quicker to build
 * Less memory efficient
 * At this scale, nearly as fast
 */
async function asyncSolutionSorting(logSources, printer) {
  let entries = await Promise.all(
    logSources.map(async (source, index) => ({
      entry: await source.popAsync(),
      index,
    }))
  );

  entries = entries.filter((e) => e.entry);

  while (entries.length > 0) {
    entries.sort((a, b) => a.entry.date - b.entry.date);
    const { entry, index } = entries.shift();
    printer.print(entry);
    const nextEntry = await logSources[index].popAsync();
    if (nextEntry) {
      entries.push({ entry: nextEntry, index });
    } else {
      console.log(`Log source ${index} is drained.`);
    }
  }
  printer.done();
}

module.exports = async (logSources, printer) => {
  console.log("Starting async sort...");
  await asyncSolutionHeapOptimized(logSources, printer);
  console.log("Finished sort complete.");
};
