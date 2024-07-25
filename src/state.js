class State {
  constructor() {
    this.userId = null;
    this.lastPage = null; // Property to store the last page
    this.page = null; // Property to store the current page
    this.currentWorkout = null;
    this.currentExercise = null;
    this.project = null;
    this.pid = null;
    this.client = null;
  }

  setUserId(id) {
    this.userId = id;
  }

  getUserId() {
    return this.userId;
  }

  // Combined method to set both current and last pages
  setPages(page) {
    this.lastPage = this.page;
    this.page = page;
    this.removePages();
  }

  getLastPage() {
    return this.lastPage; // Method to get the last page
  }

  getPage() {
    return this.page; // Method to get the current page
  }

  setCurrentWorkout(currentWorkout) {
    this.currentWorkout = currentWorkout;
  }

  setCurrentExercise(currentExercise) {
    this.currentWorkout = currentExercise;
  }

  getCurrentWorkout() {
    return this.currentWorkout;
  }

  getCurrentExercise() {
    return this.currentExercise;
  }
}

export const state = new State();
