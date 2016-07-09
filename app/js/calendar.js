'use strict'

const weekDayList = new Map([
  ['th0', '日'],
  ['th1', '月'],
  ['th2', '火'],
  ['th3', '水'],
  ['th4', '木'],
  ['th5', '金'],
  ['th6', '土']
]);
let calendar;

window.onload = function () {
  createCalendar(location.hash);
};

function createCalendar(hashDate) {
  calendar = new Calendar(hashDate.slice(1));
  document.getElementById('current').innerText = calendar.getDisplayMonth();
  // ストレージ確認
  let start = localStorage.getItem('start-week');
  if (start !== null) {
    let options = document.getElementById('start-week-selection').getElementsByTagName('option');
    for (let i = 0; i < options.length; i++) {
      if (start == options[i].value) {
        options[i].selected = true;
      }
    }
  } else {
    start = '0';
  }
  setupCalendar(Number(start));
}

// 開始曜日の設定
function changeCalendar(obj) {
  const start = obj.options[obj.selectedIndex].value;
  localStorage.setItem('start-week', start);
  setupCalendar(Number(start));
}

// 一月分進める
function nextMonth(calendar) {
  const dateHash = calendar.getNext();
  const url = location.href.split('#');
  location.href = `${url[0]}#${dateHash}`;
  createCalendar(location.hash);
}

// 一月分戻す
function prevMonth(calendar) {
  const dateHash = calendar.getPrev();
  const url = location.href.split('#');
  location.href = `${url[0]}#${dateHash}`;
  createCalendar(location.hash);
}

// 当月に戻る
function backNowMonth() {
  const url = location.href.split('#');
  location.href = url[0];
  createCalendar(location.hash);
}

function setupCalendar(leadWeekPosition) {
  // 開始曜日の設定
  const thChildren = document.getElementById('week').children;
  for (let thOrder = 0, position = leadWeekPosition; thOrder < thChildren.length; thOrder++, position++) {
    thChildren[thOrder].innerText = weekDayList.get(`th${position}`);
    thChildren[thOrder].setAttribute(`th${position}`, `th${position}`);
  }
  if (leadWeekPosition === 1) {
    thChildren[thChildren.length - 1].setAttribute('th0', 'th0');
    thChildren[thChildren.length - 1].innerText = weekDayList.get('th0');
  }

  // 月末月初の日付を取得
  const curMonthFirst = new Date(calendar.getCurrentYear(), calendar.getCurrentMonth(), 1);
  const curMonthLast = new Date(calendar.getCurrentYear(), calendar.getCurrentMonth() + 1, 0);

  // 前月分
  const week1Children = document.getElementById(`week1`).children;
  if (curMonthFirst.getDay() != leadWeekPosition) {
    const prevMonthLast = new Date(calendar.getCurrentYear(), calendar.getCurrentMonth(), 0);
    for (let day = prevMonthLast.getDate(), prevEndPos = prevMonthLast.getDay(); prevEndPos >= 0; prevEndPos--, day--) {
      if (leadWeekPosition === 1 && day === prevMonthLast.getDate()) {
        prevEndPos -= 1;
      }
      week1Children[prevEndPos].setAttribute('class', 'no-current-month');
      week1Children[prevEndPos].innerText = day;
    }
  }

  if (CalendarUtil.isThisMonth(calendar.currentDate)) {
    document.getElementById('now').setAttribute('disabled', 'disabled');
  } else {
    document.getElementById('now').removeAttribute('disabled');
  }
  // 選択月
  // 折り返し曜日の設定
  const lastWeekPosition = (leadWeekPosition === 1) ? 0 : 6;
  let weekPos = 1;
  for (let day = 1; day <= curMonthLast.getDate(); day++) {
    document.getElementById(`week${weekPos}`).removeAttribute('style');
    let oneDate = new Date(calendar.getCurrentYear(), calendar.getCurrentMonth(), day);
    let children = document.getElementById(`week${weekPos}`).children;
    let pos;
    if (leadWeekPosition === 1) {
      pos = (oneDate.getDay() === lastWeekPosition) ? children.length - 1 : oneDate.getDay() - 1;
    } else {
      pos = oneDate.getDay();
    }
    children[pos].innerText = day;
    children[pos].removeAttribute('class');
    // 曜日判定
    if (oneDate.getDay() === 0) {
      children[pos].setAttribute('class', 'sunday');
    } else if (oneDate.getDay() === 6) {
      children[pos].setAttribute('class', 'saturday');
    }
    // 当日判定
    if (CalendarUtil.isToday(oneDate)) {
      children[pos].setAttribute('class', 'today');
    }
    if (oneDate.getDay() === lastWeekPosition && day !== curMonthLast.getDate()) {
      weekPos++;
    }
  }
  if (weekPos < 6) {
    for (let i = weekPos + 1 ; i <= 6 ; i++) {
      document.getElementById(`week${i}`).setAttribute('style', 'display: none;');
    }
  }
  // 翌月分
  const lastWeekChildren = document.getElementById(`week${weekPos}`).children;
  if (curMonthLast.getDay() != lastWeekPosition) {
    const nextStartDate = new Date(calendar.getCurrentYear(), calendar.getCurrentMonth() + 1, 1);
    for (let day = 1, nextWeekPos = nextStartDate.getDay(); nextWeekPos < lastWeekChildren.length; day++, nextWeekPos++) {
      if (leadWeekPosition === 1) {
        if (nextWeekPos === 0) {
          nextWeekPos = lastWeekChildren.length - 1;
        } else if (day === nextStartDate.getDate()) {
          nextWeekPos -= 1;
        }
      }
      lastWeekChildren[nextWeekPos].innerText = day;
      lastWeekChildren[nextWeekPos].setAttribute('class', 'no-current-month');
    }
  }
}