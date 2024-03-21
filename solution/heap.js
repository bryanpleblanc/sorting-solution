function bubbleUp(heap, index) {
  let parentIndex = Math.floor((index - 1) / 2);
  while (index > 0 && heap[parentIndex].entry.date > heap[index].entry.date) {
    [heap[parentIndex], heap[index]] = [heap[index], heap[parentIndex]];
    index = parentIndex;
    parentIndex = Math.floor((index - 1) / 2);
  }
}

function sinkDown(heap, index) {
  const size = heap.length;
  const leftChildIndex = 2 * index + 1;
  const rightChildIndex = 2 * index + 2;
  let smallest = index;

  if (
    leftChildIndex < size &&
    heap[leftChildIndex].entry.date < heap[smallest].entry.date
  ) {
    smallest = leftChildIndex;
  }
  if (
    rightChildIndex < size &&
    heap[rightChildIndex].entry.date < heap[smallest].entry.date
  ) {
    smallest = rightChildIndex;
  }

  if (smallest !== index) {
    [heap[index], heap[smallest]] = [heap[smallest], heap[index]];
    sinkDown(heap, smallest);
  }
}

function insert(heap, element) {
  heap.push(element);
  bubbleUp(heap, heap.length - 1);
}

function extractMin(heap) {
  const min = heap[0];
  const lastElement = heap.pop();
  if (heap.length > 0) {
    heap[0] = lastElement;
    sinkDown(heap, 0);
  }
  return min;
}

module.exports = { insert, extractMin };
