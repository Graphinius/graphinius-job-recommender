import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { ITypedEdge } from 'graphinius/lib/core/typed/TypedEdge';
import { ITypedNode } from 'graphinius/lib/core/typed/TypedNode';
import { TypedGraph } from 'graphinius/lib/core/typed/TypedGraph';



const users_columns = ['UserID', 'WindowID', 'Split', 'City', 'State', 'Country', 'ZipCode', 'DegreeType', 'Major', 'GraduationDate', 'WorkHistoryCount', 'TotalYearsExperience', 'CurrentlyEmployed', 'ManagedOthers', 'ManagedHowMany'];
const first1KUsersFile = path.join(__dirname, '../data/first_1K_users.tsv');
const allUsers = path.join(__dirname, '../data/original/users.tsv');

(async () => {
  const g = new TypedGraph('job recommender BIG');

  const rl = readline.createInterface({
    input: fs.createReadStream(allUsers) // first1KUsersFile
  });

  let line_no = 0;

  // event is emitted after each line
  rl.on('line', line => {
    if (line_no++ === 1) {
      return;
    }
    const line_arr = line.split('\t');
    // console.log(line_arr);
    const node = g.addNodeByID(line_arr[0], { type: 'User' });
    for (let i = 1; i < users_columns.length; i++) {
      node.setFeature(users_columns[i], line_arr[users_columns[i]]);
    }
  });


  // end
  rl.on('close', function (line) {
    console.log(g.stats);
    console.log('Total lines read : ' + line_no);
  });

})();


