'use strict';

module.exports = function defaultDeployment() {
  return {
    name: 'default',
    examples: {
      commonFiles: {
        scripts: ['../../../node_modules/angular/angular.js']
      },
      dependencyPath: '../../../'
    },
    scripts: []
  };
};
