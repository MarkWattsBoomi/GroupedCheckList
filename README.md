## Class Name
GroupedCheckList

## Function
The component takes a list of objects via the data source.
It interprets the data into a consistent internal model using the attributes to map the datasource object properties.
It groups the items based on the groupByProperty.
It then displays collapsible sections for the groups.
Grouped items are selectable via check boxes.
Selected items are stored back to the state list value.

## Component Definition
There is a .component file in the project root folder to import into Flow.
It will need re-pointing to your local copy of the .js & .css files.

## Datasource
A list of items to display.

## State
A list of the same type as the datasource to receive the list of selected items.

## Label
A title to be displayed at the top of the component.

## Searchable
If true then a search box is shown beneath the title.  This allows searching on all displayed columns.

## Display Columns
Which elements of the underlying model to display, their order and column labels.

## Attributes
### sortByProperty
This tells the component the property name on the model which it should sort list items by.

### groupByProperty
This tells the component the property name on the model which should be used to group objects.  The component
will create collapsible group sections for the distinct values in this field.

### intialExpanded
This tells the component which groups should be expanded initially.  Options are "all", "none" & "first".

### onClickOutcome
This tells the component which outcome should be triggered when a single item's link is clicked.  If not specified then this feature is removed.

### rowLevelState
This tells the component which flow value should recieve the single object clicked.  If not specified then this feature is removed.