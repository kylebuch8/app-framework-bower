;(function() {
"use strict";

angular.module('app-framework', ['app-framework.directives.drawer-panel','app-framework.directives.nav-drawer','app-framework.services.component-registry']);
angular.module('app-framework.directives.drawer-panel', [
    'app-framework.services.component-registry'
])
    .directive('afDrawerPanel', afDrawerPanel)
    .factory('$afDrawerPanel', drawerPanel);

afDrawerPanel.$inject = ['$afComponentRegistry'];

function afDrawerPanel($afComponentRegistry) {
    DrawerPanelController.$inject = ['$scope', '$element', '$attrs'];

    function DrawerPanelController($scope, $element, $attrs) {
        var vm = this;

        $scope.open = false;

        vm.toggleDrawer = function () {
            $scope.open = !$scope.open;
            $element.find('af-nav-drawer').toggleClass('open');
        };

        vm.destroy = $afComponentRegistry.register(vm, $attrs.afComponentId);
    }

    var directive = {
        restrict: 'AE',
        transclude: true,
        template: '<button class="hamburger" type="button" role="button" aria-label="Toggle Navigation" style="position: fixed; z-index: 1006; height: 60px;" ng-class="{ \'open\': open }" ng-click="vm.toggleDrawer()">' +
                      '<span class="lines"></span>' +
                  '</button>' +
                  '<ng-transclude></ng-transclude>' +
                  '<af-scrim ng-class="{ \'show\': open }" ng-click="vm.toggleDrawer()"></af-scrim>',
        controller: DrawerPanelController,
        controllerAs: 'vm'
    };

    return directive;
}

drawerPanel.$inject = ['$afComponentRegistry'];

function drawerPanel($afComponentRegistry) {
    return function (handle) {
        var instance = $afComponentRegistry.get(handle);
        var service = {
            toggle: toggle
        };

        return service;

        function toggle() {
            return instance && instance.toggleDrawer();
        }
    };
}

angular.module('app-framework.directives.nav-drawer', [])
    .directive('afNavDrawer', afNavDrawer);

function afNavDrawer() {
    var directive = {
        restrict: 'AE'
    };

    return directive;
}


angular.module('app-framework.services.component-registry', [])
    .factory('$afComponentRegistry', afComponentRegistry);

function afComponentRegistry() {
    var instances = [];
    var service = {
        get: get,
        register: register,
        getInstances: getInstances
    };

    return service;

    function get(handle) {
        var instance,
            i = 0,
            length = instances.length;

        for (i; i < length; i += 1) {
            instance = instances[i];

            if (instance.$$afHandle === handle) {
                return instance;
            }
        }

        return null;
    }

    function register(instance, handle) {
        if (!handle) {
            return angular.noop;
        }

        instance.$$afHandle = handle;
        instances.push(instance);

        return deregister;

        function deregister() {
            var index = instances.indexOf(instance);
            if (index !== -1) {
                instances.splice(index, 1);
            }
        }
    }

    function getInstances() {
        return instances;
    }
}
}());
