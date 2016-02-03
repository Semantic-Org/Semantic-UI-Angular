# Contributing to Semantic-UI-Angular

We are grateful for the help and ideas of the AngularJS and Semantic-UI community. This guide will describe how _you_ can contribute and make this a first-rate module.

- [Getting Help](#getting-help)
- [Reporting Issues](#issues)
  - [Submitting an issue](#submitting)
- [Requesting Features](#newfeatures)
- [Git Commit Guidelines](#committing)
- [Submitting a Pull Request](#pr)


## <a name="getting-help"></a> Getting Help

Firstly, we unfortunately can't answer general questions or address comments for [Semantic-UI][sui]. You can ask those questions [here][suihelp].

Similarly, questions and comments for AngularJS should be directed [here][angularhelp].

Finally, we ask that you do not use GitHub Issues to ask questions. Instead, please use our [Gitter] or [StackOverflow] for help.

## <a name="issues"></a> Reporting Issues

If you find a bug in the source code, an issue with an implementation, or a mistake in the documentation, you can help by submitting an issue in [GitHub Issues][githubissues] for this [repository](https://github.com/Semantic-Org/Semantic-UI-Angular/issues).

### <a name="submitting"></a> Submitting an Issue

Please search through [existing issues][githubissues] and the archive first to see if your question was already answered or if the issue you are experiencing has already been reported. We need your help to not duplicate issues so we can focus on fixing issues and working on new features.

Once you have determined that you have an unreported problem, please use the following guidelines when opening an issue.

- Overview of the Issue - Include any non-minified stack trace and other runtime errors that are available and relevant to the issue.
- Use Case - explain why this is a bug for you
- Angular, Semantic UI, and Semantic UI Angular Version(s) - Is this an issue with Angular, the Semantic UI CSS framework, or a regression issue with this module?
- Browsers and Operating System - Is this a problem with all browsers, or specific browsers and/or specific OS? Also, be aware that browser requirements for Angular and Semantic UI apply and are the baseline requirements for this module.
- Reproduce the Error - Please, please, please **provide a live example** (using [Plunker](http://plnkr.co) or [JSFiddle](https://jsfiddle.net)) or an unambiguous set of steps! Doing the footwork up front will allow us to replicate and fix the problem faster.
- Related Issues - Please note any related issues, if any.
- Suggest a Fix - If you have an idea of what's causing the problem (line of code or a commit), please point it out.

## <a name="newfeatures"></a> Requesting Features

You can submit an issue in [GitHub Issues][githubissues]. If you would like to implement it yourself, then consider the scope of the change:

- **Major Change**: If you are interested in a major change, please [get in touch](#getting-help) with the team so we can coordinate our efforts, avoid duplicate work, and ensure your contributions are successfully accepted into the project.
- **Minor Change**: If the change is small, you can fork the [repository][github] and create a Pull Request with your changes. See [Submitting a Pull Request](#pullrequest) for more information.

## <a name="committing"></a> Git Commit Guidelines

We follow the `conventional-changelog` format used by the AngularJS team. You can follow the format manually, but we highly recommend you use a CLI wizard such as [Commitizen][commitizen].

In fact, we have configured this repository to work with Commitizen. First, ensure Commitizen CLI is installed via `npm install -g commitizen`. Next, make sure the clone of this repository is installed via `npm install`. You're all set! Now, whenever you want to commit, just stage your changes e.g. `git add .` and commit using `git cz`. Follow the prompts and you're done.


### Commit Message Format

Each commit message should consist of up to three lines: **header**, **body**, and **footer**. Additionally, the **header** should be a special format containing the **type**, **scope**, and **subject**.

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory, however, the **scope** of the header is optional.

Every line should be no longer than 100 characters.

### Revert

Commits that revert a previous commit should begin with `revert: ` followed by the header of the reverted commit. The body should read `This reverts commit <hash>`, where **hash** is the SHA of the commit you are reverting.

### Type

Must be one of the following:

* **feat**: A new feature
* **fix**: A bug fix
* **docs**: Documentation only changes
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **perf**: A code change that improves performance
* **test**: Adding missing tests
* **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation

### Scope

The scope should be the aspect or subfeature being affected, such as a module, element, or collection. For example: `modules/checkbox`, `elements/button`, etc.

### Subject

The subject contains succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize first letter
* no dot (.) at the end

### Body

Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

### Footer

The footer should contain any information about **Breaking Changes** and is also the place to reference GitHub issues that this commit **Closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.

## <a name="pr"></a> Submitting a Pull Request

Please follow these steps to submit a pull request:

* Look through existing [GitHub pull requests][githubprs] to see if a similar pull request already exists, to avoid duplicating efforts.
* After cloning the [repo][githubrepo], install the dev dependencies using `npm install`.
* Check out a work branch for your changes. `npm checkout -b my-fix master`.
* Make your changes, **including test cases**.
* Run tests using `npm run test`. Ensure all tests pass and any linting warnings or errors are corrected.
* Commit using our [Git Commit Guidelines](#committing).
* Submit a pull request to `Semantic-UI-Angular:master`.
* We will review your PR, and may suggest changes. If changes are suggested:
  * Make the requested changes.
  * Rerun the test task and correct any issues.
  * Commit the changes to your branch using the commit guidelines.
  * Push the changes to your fork. This will update the PR automatically.
* Once your PR has been accepted and merged, you can pull the changes into `master` on your fork and delete your work branch.

### Updating an out of date Pull Request

If your pull request is too out of date (resulting in merge conflicts or your changes drift out of scope), we will ask you to rebase and force push the changes to your work branch to update the pull request.

    git fetch upstream
    git checkout master
    git merge upstream/master
    git checkout my-fix
    git rebase master -i
    git push origin my-fix -f


[sui]: http://semantic-ui.com
[suihelp]: https://github.com/semantic-org/semantic-ui/#getting-help
[angularhelp]: https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#-got-a-question-or-problem
[gitter]: https://gitter.im/Semantic-Org/Semantic-UI-Angular
[stackoverflow]: http://stackoverflow.com/questions/tagged/semantic-ui-angular
[github]: https://github.com/Semantic-Org/Semantic-UI-Angular
[githubissues]: https://github.com/Semantic-Org/Semantic-UI-Angular/issues
[commitizen]: https://github.com/commitizen/cz-cli
[githubprs]: https://github.com/Semantic-Org/Semantic-UI-Angular/pulls
[githubrepo]: https://github.com/Semantic-Org/Semantic-UI-Angular.git
