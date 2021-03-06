"use strict";

const Me = imports.misc.extensionUtils.getCurrentExtension();

const CommandLine = Me.imports.src.data.datasource.commandLine;

const PROGRAM = "cron";
const COMMAND_LIST_ALL = "crontab -l";
const LIST_ROWS_SEPARATOR = "\n";

/**
 * Check whether cron is installed.
 * 
 * @return {boolean} true if cron is installed, false otherwise
 */
/* exported isCronInstalled */
var isCronInstalled = () => CommandLine.find(PROGRAM) !== null;

/**
 * Retrieve all cron jobs.
 * 
 * @return {Promise} the cron jobs as a list of { id, isRunning, name }, or fails if an error occur
 */
/* exported getJobs */
var getJobs = () => new Promise((resolve, reject) => {
    CommandLine.execute(COMMAND_LIST_ALL)
        .then(result => {
            const jobs = parseJobs(result);
            if (jobs.length === 0) {
                reject("No job detected!");
            }
            resolve(jobs);
        })
        .catch(_ => {
            reject("Cannot retrieve jobs!");
        });
});

/**
 * Parse cron list command result, and return a list of jobs.
 * 
 * @return {Array} the cron jobs as a list of { id, isRunning }
 */
var parseJobs = (result) => {
    const jobs = result.split(LIST_ROWS_SEPARATOR);
    return jobs
        .filter(item => item.length > 0)
        .map(item => {
            item = item.trim();
            return _parseJob(item);
        });
};

const _parseJob = (stdout) => {
    let job = {};
    job.id = stdout;
    job.isRunning = true;
    return job;
};
