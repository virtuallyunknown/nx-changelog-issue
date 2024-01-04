import { execSync } from 'node:child_process';
import { inc, clean } from 'semver';
import Enquirer from "enquirer";
import { releaseChangelog, releaseVersion } from 'nx/src/command-line/release';

const { prompt } = Enquirer;

const currVersion = clean(execSync('git describe --tags --abbrev=0', { encoding: 'utf-8' }));

if (!currVersion) {
    throw new Error('Unable to retrieve version from git tags.');
}

const bumpedVersions = (['patch', 'minor', 'major'] as const)
    .map(type => ({ type: type, bump: inc(currVersion, type) }));

const options = await prompt([
    {
        name: 'version',
        type: 'select',
        message: 'What kind of change is this for your packages?',
        choices: bumpedVersions.map(ver => {
            if (!ver.bump) {
                throw new Error(`Unable to create bump for ${ver.type}.`);
            }
            return {
                name: ver.bump,
                message: `${ver.type}: (${ver.bump})`
            }
        })
    },
    {
        name: 'dryRun',
        type: 'confirm',
        initial: true,
        required: true,
        message: 'Do you want to dry run these commands?'
    },
]) as { version: string, dryRun: boolean, publish: boolean }

const { projectsVersionData, workspaceVersion } = await releaseVersion({
    dryRun: options.dryRun,
    specifier: options.version,
    verbose: true,
    gitTag: true,
    gitCommit: true,
    gitCommitMessage: 'chore: release v{version}',
    stageChanges: true,
});

await releaseChangelog({
    dryRun: options.dryRun,
    verbose: true,
    versionData: projectsVersionData,
    version: workspaceVersion,
    gitTag: false,
    gitCommit: false,
    from: currVersion,
    to: options.dryRun ? 'HEAD' : options.version,
});

process.exit(0);