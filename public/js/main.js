function setDate() {
    var todaydate = dayjs();
    document.getElementById('date').value = todaydate.format('YYYY-MM-DD');
}
setDate();