import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import * as uuid from 'uuid';
import { ITypedEdge } from 'graphinius/lib/core/typed/TypedEdge';
import { ITypedNode, TypedAdjSets } from 'graphinius/lib/core/typed/TypedNode';
import { TypedGraph } from 'graphinius/lib/core/typed/TypedGraph';

const v4 = uuid.v4;


(async () => {
  const g = new TypedGraph('job recommender BIG');

  createUsers(g);
  createJobs(g);
  createApps(g);

  // console.log(g.stats);

})();



function createUsers(g: TypedGraph) {
  const users_columns = ['UserID', 'WindowID', 'Split', 'City', 'State', 'Country', 'ZipCode', 'DegreeType', 'Major', 'GraduationDate', 'WorkHistoryCount', 'TotalYearsExperience', 'CurrentlyEmployed', 'ManagedOthers', 'ManagedHowMany'];
  // const first1KUsersFile = path.join(__dirname, '../data/first_1K_users.tsv');
  const allUsersFile = path.join(__dirname, '../data/original/users.tsv');

  const rl = readline.createInterface({
    input: fs.createReadStream(allUsersFile) // first1KUsersFile
  });

  let line_no = 0;

  // event is emitted after each line
  rl.on('line', line => {
    if (line_no++ === 1) {
      return;
    }
    const line_arr = line.split('\t');
    
    const node = g.addNodeByID('user_'+line_arr[0], { type: 'User' });
    for (let i = 1; i < users_columns.length; i++) {
      node.setFeature(users_columns[i], line_arr[users_columns[i]]);
    }
  });

  // end
  rl.on('close', function (line) {
    console.log(g.stats);
    console.log('Total lines read : ' + line_no);
  });
}



function createJobs(g: TypedGraph) {
  const jobs_columns = ['JobID', 'WindowID', 'Title', 'Description', 'Requirements', 'City', 'State', 'Country', 'Zip5', 'StartDate', 'EndDate'];
  const allJobsFile = path.join(__dirname, `../data/original/jobs.tsv`);

  const jobIDs = {};

  const rl = readline.createInterface({
    input: fs.createReadStream(allJobsFile)
  });


  let line_no = 0;

  // event is emitted after each line
  rl.on('line', line => {
    if (line_no++ === 1) {
      return;
    }
    const line_arr = line.split('\t');
    
    const jid = 'jobs_' + line_arr[0];
    // console.log(jid);
    if ( jobIDs[jid] ) {
      return;
    }

    const node = g.addNodeByID(jid, { type: 'Job' });
    for (let i = 1; i < jobs_columns.length; i++) {
      node.setFeature(jobs_columns[i], line_arr[jobs_columns[i]]);
    }
    jobIDs[jid] = true;
  });


  // end
  rl.on('close', function (line) {
    console.log(g.stats);
    console.log('Total lines read : ' + line_no);
  });

}



function createApps(g: TypedGraph) {
  const apps_columns = ['UserID',	'WindowID',	'Split',	'ApplicationDate',	'JobID'];
  const allAppsFile = path.join(__dirname, `../data/original/apps.tsv`);

  const rl = readline.createInterface({
    input: fs.createReadStream(allAppsFile)
  });


  let line_no = 0;

  // event is emitted after each line
  rl.on('line', line => {
    if (line_no++ === 1) {
      return;
    }
    const line_arr = line.split('\t');
    
    const node = g.addEdgeByNodeIDs(v4(), line_arr[0], line_arr[line_arr.length-1],  { type: 'APPLIED_TO' });
    // for (let i = 1; i < apps_columns.length; i++) {
    //   node.setFeature(apps_columns[i], line_arr[apps_columns[i]]);
    // }
  });


  // end
  rl.on('close', function (line) {
    console.log(g.stats);
    console.log('Total lines read : ' + line_no);
  });
}