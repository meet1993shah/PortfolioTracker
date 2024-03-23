# Design Requirements

* Should have a top panel with bunch of options like -
	* Portfolio Options -
		* Add a new portfolio entry
		* Update an existing portfolio entry
		* Delete a portfolio entry
	* Investment Options -
		* Add a new investment
		* Update an existing investment
		* Delete an investment
* Should have left panel with Visualizations Options -
		* See future balance projections
		* Pie chart for individual entry
		* investment projections
		* Retirement goal calculator
		* See past entries
* Right entire area should be for visualization

* Design should look like -
```python
'''
+----------------------------------------------------------------+
|                       Portfolio Options                        |
|    Add Entry            Update Entry          Delete Entry     |
+----------------------------------------------------------------+
|                      Investment Options                        |
|  Add Investment       Update Investment     Delete Investment  |
+----------------+-----------------------------------------------+
| Visualizations |                                               |
|                |                                               |
|                |                                               |
|  Projections   |                                               |
|                |                                               |
|                |                                               |
|  Pie Charts    |                                               |
|                |                                               |
|                |                                               |
|  RE Calculator |                Visualizations                 |
|                |                                               |
|                |                                               |
|  Past Entries  |                                               |
|                |                                               |
|                |                                               |
|                |                                               |
|                |                                               |
|                |                                               |
|                |                                               |
|                |                                               |
|                |                                               |
+----------------+-----------------------------------------------+
'''
```


* Add entry should open a form in a window to add a new entry.
The form will have all the current investments with empty boxes for input. Only 1 entry per date should be allowed.
	* This should add an entry in the portfolio table.

* Update Entry should open a form in a window which will first ask for the entry date and then close the existing window and open another form with that existing entry and option to edit and submit.
	*  This should update an entry in the portfolio table.

* Delete Entry should open a form in a window which will first ask for the entry date and if it exists, then open a dialog box to confirm for deletion.
	* This should delete the entry from the portfolio table.

* Add new investment should open a form in a window to add a new investment value. Same name cannot be used for multiple investments.
	* This will add an entry in the investment table.

* Update investment should open a form in a window which will first for the existing investment name and also the new investment name and open a dialog box to confirm the name change.
	* This would update an entry in the investment table.
	* This would also update all entries in the portfolio table.

* Delete investment should open a form in a window which will ask for the existing investment name and it should only allow to delete if no entries in the portfolio table is using it.

* Projections should open a form in a window that will have radio button for either total balance or individual investment. On submitting it should display the projections in a line graph an bar graph.

* Pie Charts should open a form in a window that will ask for the entry date and it should disply the investment pie chart for that entry date.

* RE calculator should open a form in a window that takes final amount goal and displays on what date it would be achieved.

* Past Entries will display the entries in a table.

* All visualizations will be displayed in the right side box.

* At the beginning the past 10 entries will be displayed.
