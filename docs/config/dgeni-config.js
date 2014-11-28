var path = require('canonical-path');
var Package = require('dgeni').Package;

module.exports = new Package('dgeni-demo', [
  require('dgeni-packages/ngdoc')
])

.factory(require('./deployments/default'))
.processor(require('./processors/index-page'))

.config(function(dgeni, log, readFilesProcessor, writeFilesProcessor) {

  dgeni.stopOnValidationError = true;
  dgeni.stopOnProcessingError = true;

  log.level = 'info';

  readFilesProcessor.basePath = path.resolve(__dirname, '../../');
  readFilesProcessor.sourceFiles = [
    {include: 'src/**/*.js', basePath: 'src'},
    {include: 'docs/content/**/*.ngdoc', basePath: 'docs/content'}
  ];

  writeFilesProcessor.outputFolder = 'dist/docs';
})

.config(function(templateFinder, templateEngine) {

  templateEngine.config.tags = {
    variableStart: '{$',
    variableEnd: '$}'
  };

  templateFinder.templateFolders.unshift(path.resolve(__dirname, 'templates'));

  templateFinder.templatePatterns = [
    '${ doc.template }',
    '${ doc.id }.${ doc.docType }.template.html',
    '${ doc.id }.template.html',
    '${ doc.docType }.template.html',
    'common.template.html'
  ];
})

.config(function(computePathsProcessor, computeIdsProcessor) {
  computePathsProcessor.pathTemplates.push({
    docTypes: ['overview'],
    getPath: function(doc) {
      var docPath = path.dirname(doc.fileInfo.relativePath);
      return docPath;
    },
    outputPathTemplate: 'partials/${path}.html'
  });

  computePathsProcessor.pathTemplates.push({
    docTypes: ['indexPage'],
    pathTemplate: '.',
    outputPathTemplate: '${id}.html'
  });

  computePathsProcessor.pathTemplates.push({
    docTypes: ['module'],
    pathTemplate: '${area}/${name}',
    outputPathTemplate: 'partials/${area}/${name}.html'
  });

  computeIdsProcessor.idTemplates.push({
    docTypes: ['overview', 'indexPage'],
    getId: function(doc) { return doc.fileInfo.baseName; },
    getAliases: function(doc) { return [doc.id]; }
  });

})

.config(function(generateIndexPagesProcessor, defaultDeployment) {

  generateIndexPagesProcessor.deployments = [
    defaultDeployment
  ];
});
