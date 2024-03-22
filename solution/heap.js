// Heap maintaince - element moves to correct position
function moveUp(heap, index) {
  let parentIndex = Math.floor((index - 1) / 2);
  while (index > 0 && heap[parentIndex].entry.date > heap[index].entry.date) {
    [heap[parentIndex], heap[index]] = [heap[index], heap[parentIndex]];
    index = parentIndex;
    parentIndex = Math.floor((index - 1) / 2);
  }
}

// Restores the heap's properties after the root has been replaced with the last element
function moveDown(heap, index) {
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
    moveDown(heap, smallest);
  }
}

// Adds a new element to the heap
function insert(heap, element) {
  heap.push(element);
  moveUp(heap, heap.length - 1);
}

// Removes and returns smallest element in the heap (root)
function extractMin(heap) {
  const min = heap[0];
  const lastElement = heap.pop();
  if (heap.length > 0) {
    heap[0] = lastElement;
    moveDown(heap, 0);
  }
  return min;
}

module.exports = { insert, extractMin };
