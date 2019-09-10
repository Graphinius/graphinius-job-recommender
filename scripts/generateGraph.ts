import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';
import { ITypedEdge } from 'graphinius/lib/core/typed/TypedEdge';
import { ITypedNode, TypedAdjSets } from 'graphinius/lib/core/typed/TypedNode';
import { TypedGraph } from 'graphinius/lib/core/typed/TypedGraph';

const v4 = uuid.v4;


(async () => {
  const g = new TypedGraph('job recommender BIG');
  
  createUsers(g);
  console.log(g.stats);
  console.log(g.n('user_47'));

  createJobs(g);
  console.log(g.stats);
  console.log(g.n('job_169528'));

  createApps(g);
  console.log(g.stats);
})();



function createUsers(g: TypedGraph) {
  const users_columns = ['UserID', 'WindowID', 'Split', 'City', 'State', 'Country', 'ZipCode', 'DegreeType', 'Major', 'GraduationDate', 'WorkHistoryCount', 'TotalYearsExperience', 'CurrentlyEmployed', 'ManagedOthers', 'ManagedHowMany'];
  const allUsersFile = path.join(__dirname, '../data/original/users.tsv');

  const file = fs.readFileSync(allUsersFile).toString().split('\n');
  file.shift();
  file.forEach(line => {
    const line_arr = line.split('\t');

    const node = g.addNodeByID('user_' + line_arr[0], { type: 'User' });
    // for (let i = 1; i < users_columns.length; i++) {
    //   node.setFeature(users_columns[i], line_arr[i]);
    // }
  });
}



function createJobs(g: TypedGraph) {
  const jobs_columns = ['JobID', 'WindowID', 'Title', 'Description', 'Requirements', 'City', 'State', 'Country', 'Zip5', 'StartDate', 'EndDate'];
  const splitFiles = [];
  [1, 2, 3, 4, 5, 6, 7].forEach(sf => {
    splitFiles.push(path.join(__dirname, `../data/original/splitjobs/jobs${sf}.tsv`));
  });

  const jobIDs = {};
  let line_arr = [];
  let jid = null;
  let node;

  for (let sf of splitFiles) {

    const file = fs.readFileSync(sf).toString().split('\n');
    file.shift();
    file.forEach(line => {
      line_arr = line.split('\t');

      jid = 'job_' + line_arr[0];
      // console.log(jid);
      if (jobIDs[jid]) {
        return;
      }

      node = g.addNodeByID(jid, { type: 'Job' });
      // for (let i = 1; i < jobs_columns.length; i++) {
      //   node.setFeature(jobs_columns[i], line_arr[i]);
      // }
      jobIDs[jid] = true;
    });

    console.log(g.stats);
  }
}



function createApps(g: TypedGraph) {
  const apps_columns = ['UserID', 'WindowID', 'Split', 'ApplicationDate', 'JobID'];
  const allAppsFile = path.join(__dirname, `../data/original/apps.tsv`);
  let line_arr = [], a, b;
  let nr_edges = 0;
  
  const file = fs.readFileSync(allAppsFile).toString().split('\n');
  file.shift();
  file.forEach(line => {
    line_arr = line.split('\t');
    // console.log(line_arr);
    a = g.n('user_' + line_arr[0]);
    // last entry in file has an additional '\r' attached...
    b = g.n('job_' + line_arr[line_arr.length - 1].replace('\r', ''));

    if ( a && b ) {
      // console.log(`Adding edge between user_${line_arr[0]} and job_${line_arr[line_arr.length - 1]}`);
      g.addEdgeByID(v4(), a, b, { type: 'APPLIED_TO' });
      if ( ++nr_edges % 10000 === 0 ) {
        console.log('added edges: ', nr_edges);
      }
    }
  });
}

