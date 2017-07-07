# Fraction-intro implementation

## Terminology

This section enumerates terms that you'll see used throughout the internal and external documentation.
In alphabetical order:

* cell - the elementary unit of a container. A cell can be filled or empty.  
* container - a collection of cells, every container has the same number of cells. 
* piece - a movable elementary unit of a fraction.
* representation - a pictorial representation of containers

There are three model properties that control the numerator, denominator and max values. The model flag 
`changingInternally` determines if the numerator has been changed by indirectly ( say through interaction 
with a piece/cell) rather than direct interaction (manipulation of numerator spinner). All internal changes to 
the value associated with numeratorProperty should be done through the method 'changeNumeratorManually'. 
The max and denominator values associated with these properties can be updated directly.
  
Observables arrays are used to keep track of pieces, containers and cells. Note that cells are units a container.
The number of cells in a container is given by the value of the denominator.  The cell position within a container 
is determined by its index. To iterate over all cells, one must iterate over the cells of all containers. 

A cell contains an attribute call targetPiece. In addition, a piece contains two attributes called destinationCell
and originCell. This allows to tag piece to a cell during a piece animation. 

The animation of piece Nodes is handled trough step function in the view. 
In the view, each representation is made of its respective view, container node, cell node and piece node. 
Each respective view is the entry point for the layout of the containers and the pieces (and bucket). 
The exception to this rule is the NumberLineView which does not have a bucket and associated piece nodes 
and container nodes. 

 
 
