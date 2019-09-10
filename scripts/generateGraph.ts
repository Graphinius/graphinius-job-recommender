import * as fs from 'fs';
import * as path from 'path';
import * as stream from 'stream';
import * as readline from 'readline';
import { ITypedEdge } from 'graphinius/lib/core/typed/TypedEdge';
import { ITypedNode } from 'graphinius/lib/core/typed/TypedNode';
import { TypedGraph } from 'graphinius/lib/core/typed/TypedGraph';



const users_columns = ['UserID', 'WindowID', 'Split', 'City', 'State', 'Country', 'ZipCode', 'DegreeType', 'Major', 'GraduationDate', 'WorkHistoryCount', 'TotalYearsExperience', 'CurrentlyEmployed', 'ManagedOthers', 'ManagedHowMany'];
const first1KUsersFile = path.join(__dirname, '../data/first_1K_users.tsv');
const allUsers = path.join(__dirname, '../data/original/users.tsv');

(async () => {
  const g = new TypedGraph('job recommender BIG');
  
  await createUsers(g);
  
  // never reaches this line...
  console.log(g.stats);
})();



async function createUsers(g: TypedGraph) {
  const input = fs.createReadStream(allUsers);
  let line_no = 0;
  for await (const line of readLines({input})) {
    if ( !line ) {
      return g.stats;
    }
    if (line_no++ === 1) {
      continue;
    }
    const line_arr = line.split('\t');
    // console.log(line_arr);
    const node = g.addNodeByID(line_arr[0], { type: 'User' });
    for (let i = 1; i < users_columns.length; i++) {
      node.setFeature(users_columns[i], line_arr[users_columns[i]]);
    }
  }
}


function readLines({input}) {
  const output = new stream.PassThrough({ objectMode: true });
  const rl = readline.createInterface({input});

  // event is emitted after each line
  rl.on('line', line => {
    output.write(line);
  });

  // end
  rl.on('close', function (line) {
    output.push(null);
  });

  return output;
}