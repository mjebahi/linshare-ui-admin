'use strict';

angular.module('linshareAdminApp')
  .directive('lsMailActivationDisplay',
  ['$rootScope', '$translate', '$compile', '$http', '$templateCache',
    function($rootScope, $translate, $compile, $http, $templateCache) {

      var baseURL = 'ng_components/mailactivation/mailactivation_',
        typeTemplateMapping = {
          simple: 'simple.tpl.html',
          advanced: 'advanced.tpl.html'
        };

      var getTemplate = function(identifier) {
        return '/i18n/templates/functionalities/' + $translate.use() + '/' + identifier + '.tpl.html';
      };

      var getIdName = function(functionality, identifier) {
        return 'MAIL_ACTIVATION.DETAILS.' + functionality + identifier;
      };

      var linker = function(scope, element) {

        scope.isOpen = false;
        scope.translations = {
          DESCRIPTION: '',
          ACTIVATION_POLICY: '',
          CONFIGURATION_POLICY: '',
          PARAMETER_DESCRIPTION: '',
          DELEGATION_POLICY: '',
          USE_EXTENDED_DESCRIPTION: ''
        };

        var initTraduction = function() {
          angular.forEach(scope.translations, function(key, value) {
            $translate(getIdName(scope.mailActivation.identifier, '.' + value)).then(function(translation) {
              scope.translations[value] = translation;
            });
          });
        };

        scope.template = getTemplate(scope.mailActivation.identifier);
        initTraduction();

        var functionality = 'MAIL_ACTIVATION.DETAILS.' + scope.mailActivation.identifier + '.USE_EXTENDED_DESCRIPTION';

        $translate(functionality).then(function(translations) {
          scope.translationValue = translations;
        });

        $rootScope.$on('$translateChangeSuccess', function() {
          scope.template = getTemplate(scope.mailActivation.identifier);
          initTraduction();
        });

        var tplURL = baseURL + typeTemplateMapping[scope.view];
        var templateLoader = $http.get(tplURL, {cache: $templateCache})
          .success(function(html) {
            element.html(html);
          }).then(function() {
            element.replaceWith($compile(element.html())(scope));
          });

        return function(scope, element) {
          templateLoader.then(function() {
            element.html($compile(element.html())(scope));
          });
        };
      };

      return {
        restrict: 'E',
        link: linker,
        controller: 'MailActivationCtrl'
      };
    }
  ]);
