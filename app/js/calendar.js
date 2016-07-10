'use strict'

var weekDayList = new Map([
  ['th0', '日'],
  ['th1', '月'],
  ['th2', '火'],
  ['th3', '水'],
  ['th4', '木'],
  ['th5', '金'],
  ['th6', '土']
]);
var calendar;

window.onload = function () {
  createCalendar(location.hash);
};

function createCalendar(hashDate) {
  calendar = new Calendar(hashDate.slice(1));
  document.getElementById('current').innerText = calendar.getDisplayMonth();
  // ストレージ確認
  var start = localStorage.getItem('start-week');
  if (start !== null) {
    var options = document.getElementById('start-week-selection').getElementsByTagName('option');
    for (var i = 0; i < options.length; i++) {
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
  var start = obj.options[obj.selectedIndex].value;
  localStorage.setItem('start-week', start);
  setupCalendar(Number(start));
}

// 一月分進める
function nextMonth(calendar) {
  var dateHash = calendar.getNext();
  var url = location.href.split('#');
  location.href = `${url[0]}#${dateHash}`;
  createCalendar(location.hash);
}

// 一月分戻す
function prevMonth(calendar) {
  var dateHash = calendar.getPrev();
  var url = location.href.split('#');
  location.href = `${url[0]}#${dateHash}`;
  createCalendar(location.hash);
}

// 当月に戻る
function backNowMonth() {
  var url = location.href.split('#');
  location.href = url[0];
  createCalendar(location.hash);
}

function setupCalendar(leadWeekPosition) {
  // 開始曜日の設定
  var thChildren = document.getElementById('week').children;
  for (var thOrder = 0, position = leadWeekPosition; thOrder < thChildren.length; thOrder++, position++) {
    thChildren[thOrder].innerText = weekDayList.get(`th${position}`);
    thChildren[thOrder].setAttribute(`th${position}`, `th${position}`);
  }
  if (leadWeekPosition === 1) {
    thChildren[thChildren.length - 1].setAttribute('th0', 'th0');
    thChildren[thChildren.length - 1].innerText = weekDayList.get('th0');
  }

  // 月末月初の日付を取得
  var curMonthFirst = new Date(calendar.getCurrentYear(), calendar.getCurrentMonth(), 1);
  var curMonthLast = new Date(calendar.getCurrentYear(), calendar.getCurrentMonth() + 1, 0);

  // 前月分
  var week1Children = document.getElementById(`week1`).children;
  if (curMonthFirst.getDay() != leadWeekPosition) {
    var prevMonthLast = new Date(calendar.getCurrentYear(), calendar.getCurrentMonth(), 0);
    for (var prevMonthDay = prevMonthLast.getDate(), prevEndPos = prevMonthLast.getDay();
         prevEndPos >= 0;
         prevEndPos--, prevMonthDay--
    ) {
      if (leadWeekPosition === 1 && prevMonthDay === prevMonthLast.getDate()) {
        prevEndPos -= 1;
      }
      week1Children[prevEndPos].setAttribute('class', 'no-current-month');
      week1Children[prevEndPos].innerText = prevMonthDay;
    }
  }

  if (CalendarUtil.isThisMonth(calendar.currentDate)) {
    document.getElementById('now').setAttribute('disabled', 'disabled');
  } else {
    document.getElementById('now').removeAttribute('disabled');
  }
  // 選択月
  // 折り返し曜日の設定
  var lastWeekPosition = (leadWeekPosition === 1) ? 0 : 6;
  var weekPos = 1;
  for (var day = 1; day <= curMonthLast.getDate(); day++) {
    document.getElementById(`week${weekPos}`).removeAttribute('style');
    var oneDate = new Date(calendar.getCurrentYear(), calendar.getCurrentMonth(), day);
    var children = document.getElementById(`week${weekPos}`).children;
    var pos;
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
    for (var i = weekPos + 1 ; i <= 6 ; i++) {
      document.getElementById(`week${i}`).setAttribute('style', 'display: none;');
    }
  }
  // 翌月分
  var lastWeekChildren = document.getElementById(`week${weekPos}`).children;
  if (curMonthLast.getDay() != lastWeekPosition) {
    var nextStartDate = new Date(calendar.getCurrentYear(), calendar.getCurrentMonth() + 1, 1);
    for (var nextMonthDay = 1, nextWeekPos = nextStartDate.getDay();
         nextWeekPos < lastWeekChildren.length;
         nextMonthDay++, nextWeekPos++
    ) {
      if (leadWeekPosition === 1) {
        if (nextWeekPos === 0) {
          nextWeekPos = lastWeekChildren.length - 1;
        } else if (nextMonthDay === nextStartDate.getDate()) {
          nextWeekPos -= 1;
        }
      }
      lastWeekChildren[nextWeekPos].innerText = nextMonthDay;
      lastWeekChildren[nextWeekPos].setAttribute('class', 'no-current-month');
    }
  }
}