## Class Name
GroupedCheckList

## Function
The component takes a list of objects via the data source.
It interprets the data into a consistent internal model using the attributes to map the datasource object properties.
It groups the items based on the groupByProperty.
It then displays collapsible sections for the groups.
Grouped items are selectable via check boxes.
Selected items are stored back to the state list value.

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

