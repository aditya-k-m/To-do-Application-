let datew = new Date();

module.exports = {
  getDayandDate: function() {
    let options = {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    };
    return datew.toLocaleDateString("en-US", options);
  },

  getDay: function() {
    let options = {
      weekday: "long"
    };
    return datew.toLocaleDateString("en-US", options);
  }
};
