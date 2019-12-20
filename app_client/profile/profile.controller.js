(function() {
  
  angular
    .module('meanApp')
    .controller('profileCtrl', profileCtrl);

  profileCtrl.$inject = ['$location', 'meanData'];
  function profileCtrl($location, meanData) {
    var vm = this;

    vm.user = {};

    meanData.getProfile()
      .success(function(data) {
        // console.log('getProfile success:' + JSON.stringify(data));
        vm.user = data;
      })
      .error(function (e) {
        // console.log('getProfile error:' + JSON.stringify(e));
        // console.log(e);
      });
  }

})();