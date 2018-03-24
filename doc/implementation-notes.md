# Fraction-intro implementation

## Terminology

This section enumerates terms that you'll see used throughout the internal and external documentation.
In alphabetical order:

* cell - the elementary unit of a container. A cell can be filled or empty.  
* container - a collection of cells, every container has the same number of cells. 
* piece - a movable elementary unit of a fraction.
* representation - a pictorial representation of containers

The animation of piece Nodes is handled trough step function in the view. 
In the view, each representation is made of its respective view, container node, cell node and piece node. 
Each respective view is the entry point for the layout of the containers and the pieces (and bucket). 
The exception to this rule is the NumberLineView which does not have a bucket and associated piece nodes 
and container nodes. 
