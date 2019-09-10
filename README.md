# job-recommender
Experiments with the 2012 Kaggle job recommender challenge in Neo4J / Graphinius / GCNs


## preliminary runs

```javascript
{
  mode: 2,
  nr_nodes: 1481806,
  nr_und_edges: 1603112,
  nr_dir_edges: 0,
  density_dir: 0,
  density_und: 0.0000014601970134727935,
  typed_nodes: { GENERIC: 0, USER: 389709, JOB: 1092097 },
  typed_edges: { GENERIC: 0, APPLIED_TO: 1603112 }
}
BFS on ~3M object graph took 2727 ms.
DFS on ~3M object graph took 18520 ms.
PFS on ~3M object graph took 2770 ms.
Pagerank on ~1.4M  node graph took 112570 ms.
```

## Improvements

* Why is DFS so slow compared to B/PFS?
* PR seems to be leaking memory...???
* Implement leaner (non-CB-based) versions of those algorithms
* Implement parallel versions of all those algorithms
* Implement TF-Based versions of those algorithms
