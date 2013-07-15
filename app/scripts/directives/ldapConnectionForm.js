'use strict';

app.directive('linshareLdapConnectionForm', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      scope: {
        ldapConnectionToEdit: '=ldapConnection'
      },
      controller: ['$scope', '$route', 'Restangular', 'loggerService',
        function($scope, $route, Restangular, Logger) {
          $scope.confirmCollapsed = true;
          // isCreation ?
          if (_.isUndefined($scope.ldapConnectionToEdit) || _.isNull($scope.ldapConnectionToEdit)) {
            $scope.submit = function(ldapConnection) {
              Logger.debug('ldapConnection creation :' + ldapConnection.identifier);
              Restangular.all('ldap_connections').post(ldapConnection).then(function successCallback(ldapConnections) {
                // refresh the page
                $route.reload();
              }, function errorCallback() {
                Logger.error('Unable to create the ldapConnection : ' + ldapConnection.identifier);
              });
            };
            $scope.reset = function() {
              $scope.ldapConnection = {};
            };
            $scope.creation = true;
          } else {
            $scope.submit = function(ldapConnection) {
              Logger.debug('ldapConnection edition :' + ldapConnection.identifier);
              ldapConnection.put().then(function successCallback(ldapConnections) {
                // refresh the page
                $route.reload();
              }, function errorCallback() {
                Logger.error('Unable to update the ldapConnection : ' + ldapConnection.identifier);
              });
            };
            $scope.reset = function() {
              $scope.ldapConnection = Restangular.copy($scope.ldapConnectionToEdit);
            };
            $scope.delete = function(ldapConnection) {
              Logger.debug('ldapConnection deletion : ' + ldapConnection.identifier);
              ldapConnection.remove().then(function successCallback(ldapConnections) {
                // refresh the page
                $route.reload();
              }, function errorCallback() {
                Logger.error('Unable to delete the ldapConnection : ' + ldapConnection.identifier);
              });
            }
            $scope.creation = false;
          }
          // Save the previous state
          $scope.reset();
        }
      ],
      templateUrl: '/views/templates/forms/ldap_connection.html',
      replace: false
    };
  }
]);