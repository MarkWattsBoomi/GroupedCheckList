import React from "react";
import "./GroupedCheckedListHeader.css";
import GroupedCheckList from "./GroupedCheckList";

export class GroupCheckedListHeader extends React.Component<any,any> {

    searchInput: HTMLInputElement;
    currentFilter: string = "";
    previousFilter: string = "";
    
    constructor(props: any) {
        super(props);

        this.filterCommitted = this.filterCommitted.bind(this);
        this.filterChange = this.filterChange.bind(this);
        this.filterKeyDown = this.filterKeyDown.bind(this);
        this.filterClear = this.filterClear.bind(this);
    }

    filterClear(e: any) {
        this.currentFilter = '';
        this.filterCommitted(e);
    }

    filterChange(e: any) {
        this.currentFilter = e.currentTarget.value;
        this.forceUpdate();
    }

    filterCommitted(e: any) {
        //if (this.currentFilter !== this.previousFilter) {
        this.previousFilter = this.currentFilter;
        let projects: GroupedCheckList = this.props.projects;
        projects.projects.setFilter(this.currentFilter);
        //}
    }

    filterKeyDown(e: any) {
        let projects: GroupedCheckList = this.props.projects;

        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                e.stopPropagation();
                this.filterCommitted(e);
                break;

            case 'Escape':
                e.preventDefault();
                e.stopPropagation();
                this.currentFilter = this.previousFilter;
                this.filterCommitted(e);
                break;

            case 'Delete':
                e.preventDefault();
                e.stopPropagation();
                this.currentFilter = '';
                this.filterCommitted(e);
                break;

            case 'Tab':
                this.filterCommitted(e);
                break;

            default:
                break;
        }
    }

    render() {
        let projects: GroupedCheckList = this.props.projects;
        let srch: any;
        if(projects.model.searchable) {
            srch = (
                <div
                    className="grpchklsthdr-srch"
                >
                    <span
                        className="glyphicon glyphicon-search grpchklsthdr-search-icon"
                        onClick={this.filterCommitted}
                    />
                    <input 
                        className="grpchklsthdr-srch-input"
                        ref={(element: HTMLInputElement) => {this.searchInput = element; }}
                        type="text" 
                        onKeyDown={this.filterKeyDown}
                        onKeyUp={(e: any) => {e.stopPropagation(); e.preventDefault(); }}
                        onChange={this.filterChange}
                        value={this.currentFilter}
                    />
                    <span
                        className="glyphicon glyphicon-remove grpchklsthdr-search-icon"
                        role="button"
                        onClick={this.filterClear}
                    />
                </div>
            );
        }
        return (
            <div
                className="grpchklsthdr"
            >
                <div
                    className="grpchklsthdr-title"
                >
                    {projects.model.label}
                </div>
                {srch}
            </div>
            
        );
    }
}