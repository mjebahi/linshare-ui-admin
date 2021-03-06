'use strict';

angular.module('linshareAdminApp')
  .controller('MimePolicyDetailCtrl',
    ['$scope', '$filter', '$timeout', '$log', '$modal', '$state', 'ngTableParams', 'MimePolicy', 'MimeType',
      'currentMimePolicy', 'currentDomain',
    // TODO: Should dispatch some function to other service or controller
    /* jshint maxparams: false */
    function($scope, $filter, $timeout, $log, $modal, $state, ngTableParams, MimePolicy, MimeType,
      currentMimePolicy, currentDomain) {
      $scope.mimePolicy = currentMimePolicy;
      $scope.iconSaved = false;
      $scope.domain = currentDomain;

      $scope.remove = function() {
        var modalInstance = $modal.open({
          templateUrl: 'ng_components/common/confirm_modal.tpl.html',
          controller: 'ConfirmDialogCtrl',
          resolve: {
            content: function() {
              return 'MIME_POLICIES.CONFIRM_DELETE_FORM.PARAGRAPH';
            }
          }
        });
        modalInstance.result.then(
          function validate() {
            MimePolicy.remove($scope.mimePolicy).then(function() {
              $state.go('mimepolicy.list');
            });
          }, function cancel() {
            $log.debug('Deletion modal dismissed');
          }
        );
      };
      $scope.displayIconSaved = function() {
        $scope.iconSaved = true;
        $timeout(function() {
          $scope.iconSaved = false;
        }, 800);
      };
      $scope.update = function() {
        MimePolicy.update($scope.mimePolicy);
      };
      $scope.updateMimeType = function(mimeType) {
        MimeType.update(mimeType).then(function() {
          $scope.displayIconSaved();
        });
      };
      $scope.enableAllMimeTypes = function(mimeConfig) {
        MimePolicy.enableAllMimeTypes(mimeConfig.uuid).then(function() {
          $scope.displayIconSaved();
          $scope.reset();
        });
      };
      $scope.disableAllMimeTypes = function(mimeConfig) {
        MimePolicy.disableAllMimeTypes(mimeConfig.uuid).then(function() {
          $scope.displayIconSaved();
          $scope.reset();
        });
      };
      $scope.reset = function() {
        $state.reinit();
      };
      $scope.tableParams = new ngTableParams({ /* jshint ignore: line */
        page: 1,        // show first page
        count: 10,      // count per page
        sorting: {
          enable: 'asc',
        }
      }, {
        debugMode: false,
        total: 0, // length of data
        getData: function($defer, params) {
          var filteredData = params.filter() ?
                    $filter('filter')($scope.mimePolicy.mimeTypes, params.filter()) :
                    $scope.mimePolicy.mimeTypes;
          var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    filteredData;
          params.total(orderedData.length);
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        },
        $scope: { $data: {}, $emit: function() {} }
      });
    }]
  );
