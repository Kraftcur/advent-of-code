class Stack {
  constructor(maxSize) {
    // Set default max size if not provided

    if (isNaN(maxSize)) {
      maxSize = 3;
    }

    this.maxSize = maxSize; // Init an array that'll contain the stack values.

    this.container = [];
  }

  // A method just to see the contents while we develop this class

  display() {
    console.log(this.container);
  }
  // Checking if the array is empty

  isEmpty() {
    return this.container.length === 0;
  }

  // Check if array is full

  isFull() {
    return this.container.length > this.maxSize;
  }

  push(element) {
    // Check if stack is full

    this.container.push(element);

    if (this.isFull()) {
      this.container.sort((a, b) => a - b);
      this.container.shift();
    }
  }

  sum() {
    return this.container.reduce((partialSum, a) => partialSum + a, 0);
  }
}

export default Stack;
