import { FlowDisplayColumn } from "flow-component-model";
import React from "react";
import "./GroupedCheckListColumns.css";
import GroupedCheckList from "./GroupedCheckList";

export class GroupCheckedListColumns extends React.Component<any,any> {

    constructor(props: any) {
        super(props);
    }

    render() {
        let projects: GroupedCheckList = this.props.projects;
        let cols: any[] = [];
        cols.push(
            <span 
                className="grpchklstcols-col-chk"
            />
        );
        projects.model.displayColumns.forEach((col: FlowDisplayColumn) => {
            cols.push(
                <span
                    className={"grpchklstcols-col grpchklstcols-col-" + col.developerName}
                >
                    {col.label}
                </span>
            );
        });
    
        return (
            <div
                className="grpchklstcols"
            >
                {cols}
            </div>
            
        );
    }
}