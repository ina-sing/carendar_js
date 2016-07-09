'use strict'

class Calendar {
  constructor(hashDate) {
    if (hashDate === '') {
      this.currentDate = new Date();
    } else {
      const dateArr = hashDate.split('/');
      this.currentDate = new Date(dateArr[0], dateArr[1] - 1);
    }
  }

  getDisplayMonth() {
    return `${this.getCurrentYear()}年${this.getCurrentMonth() + 1}月`;
  }

  getNext() {
    const date = new Date(
      this.getCurrentYear(),
      this.getCurrentMonth()
    );
    date.setMonth(date.getMonth() + 1);
    return `${date.getFullYear()}/${date.getMonth() + 1}`;
  }

  getPrev() {
    const date = new Date(
      this.getCurrentYear(),
      this.getCurrentMonth()
    );
    date.setMonth(date.getMonth() - 1);
    return `${date.getFullYear()}/${date.getMonth() + 1}`;
  }

  getCurrentYear() {
    return this.currentDate.getFullYear();
  }

  getCurrentMonth() {
    return this.currentDate.getMonth();
  }
}

class CalendarUtil {
  static isThisMonth(targetDate) {
    const today = new Date();
    return (today.getFullYear() == targetDate.getFullYear()
    && today.getMonth() == targetDate.getMonth());
  }

  static isToday(targetDate) {
    const today = new Date();
    return (today.getFullYear() == targetDate.getFullYear()
    && today.getMonth() == targetDate.getMonth()
    && today.getDate() == targetDate.getDate());
  }
}