import { FlowDisplayColumn } from "flow-component-model";
import React from "react";
import { oObject, oObjects } from "./ObjectModel";
import "./GroupedCheckListGroupMember.css";
import GroupedCheckList from "./GroupedCheckList";

export class GroupedCheckListGroupMember extends React.Component<any,any> {

    constructor(props: any) {
        super(props);

        this.colClicked = this.colClicked.bind(this);
    }

    colClicked(e: any) {
        e.preventDefault();
        e.stopPropagation();
        let projects: GroupedCheckList = this.props.projects;
        projects.itemClicked(this.props.projectId);
    }

    render() {
        let projects: GroupedCheckList = this.props.projects;
        let project: oObject = projects.projects.getObject(this.props.projectId);
        let cols: any[] = [];
        let first: boolean=true;
        projects.model.displayColumns.forEach((col: FlowDisplayColumn) => {
            //let attrName: string = projects.projects.getAttributeForDisplayColumn(col.developerName);
            let attrValue: any = project.attributes.get(col.developerName).getDisplayString();
            let colClass: string = "grpchklstgrpmem-data-col grpchklstgrpmem-data-col-" + col.developerName;
            let onClick: any; // = ((e: any) => {e.preventDefault();e.stopPropagation();});
            let title: string;
            if(projects.projects.conf.onClickOutcome && first) {
                colClass += " grpchklstgrpmem-data-col-clickable";
                onClick = this.colClicked;
                title = projects.projects.conf.onClickOutcome.label;
            }
            cols.push(
                <span
                    className={colClass}
                    onClick={onClick}
                    title={title}
                >
                    {attrValue}
                </span>
            );
            first=false;
        });


        
        return(
            <div
                className="grpchklstgrpmem"
            >
                <div
                    className="grpchklstgrpmem-checkbox-col"
                >
                    <input 
                        className="grpchklstgrpmem-checkbox"
                        type="checkbox"
                        checked={projects.projects.isSelected(this.props.projectId)}
                        onChange={(e: any) => {projects.projects.selectItem(this.props.projectId,e.currentTarget.checked); this.forceUpdate()}}
                    />
                </div>
                
                {cols}
            </div>
        );
    }
}