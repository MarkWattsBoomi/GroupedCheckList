import { eLoadingState, FlowComponent, FlowObjectDataArray} from "flow-component-model";
import React, { CSSProperties } from "react";
import "./GroupedCheckList.css";
import { FCMModal } from "fcmkit";
import { oObjectConf, oObjects } from "./ObjectModel";
import { GroupedCheckListGroup } from "./GroupedCheckListGroup";
import { GroupCheckedListHeader } from "./GroupedCheckListHeader";
import { GroupCheckedListColumns } from "./GroupedCheckListColumns";


declare var manywho: any;

export default class GroupedCheckList extends FlowComponent {

    messagebox: FCMModal;
    messageboxForm: any;
    projects: oObjects;
    expandedMode: string;

    constructor(props: any) {
        super(props);

        this.flowMoved = this.flowMoved.bind(this);
        this.loadData = this.loadData.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.redrawHandler = this.redrawHandler.bind(this);
    }

    async componentDidMount(): Promise<void> {
        await super.componentDidMount();
        (manywho as any).eventManager.addDoneListener(this.flowMoved, this.componentId);    
        this.expandedMode = this.getAttribute("intialExpanded","all").toLowerCase(); // none, all, first
        await this.loadData(); 
    }

    async componentWillUnmount() {
        await super.componentWillUnmount();
        (manywho as any).eventManager.removeDoneListener(this.componentId);
    }

    async flowMoved(xhr: any, request: any) {
        const me: any = this;
        if (xhr.invokeType === 'FORWARD') {
            if (this.loadingState !== eLoadingState.ready) {
                window.setTimeout(function() {me.flowMoved(xhr, request); }, 500);
            } else {
                await this.loadData();
            }
        }

    }

    async loadData() {
        let conf: oObjectConf = new oObjectConf();
        conf.sortByProperty = this.getAttribute("sortByProperty");
        conf.groupByProperty = this.getAttribute("groupByProperty");
        conf.displayColumns = this.model.displayColumns;
        this.projects = oObjects.parse(this.model.dataSource, conf, this.changeHandler, this.redrawHandler);
        this.forceUpdate();
    }

    async changeHandler() {
        let selectedItems: FlowObjectDataArray = this.projects.makeSelectedObjectArray();
        await this.setStateValue(selectedItems);
    }

    async redrawHandler() {
        this.forceUpdate();
    }

    render() {
        
        let style: CSSProperties = {};
        let height: string = this.getAttribute("height","60vh");
        style.height = height;
        if(this.model.visible === false) {
            style.display="none"
        }

       
        let content: any[] = [];
        content.push(
            <GroupCheckedListColumns 
                projects={this}
            />
        );
        let first: boolean = true;
        this.projects?.getGroups().forEach((group: string) => {
            content.push(
                <GroupedCheckListGroup 
                    projects={this}
                    group={group}
                    isFirst={first}
                />
            );
            first=false;
        });

        let componentClass: string = "grpchklst";
        componentClass += " " + this.getAttribute("classes","");
        
        return (
            <div
                className={componentClass}
                style={style}
            >
                <FCMModal 
                    ref={(element: FCMModal) => {this.messagebox=element}}
                />
                <GroupCheckedListHeader 
                    projects={this}
                />
                <div
                    className="grpchklst-content"
                >
                    {content}
                </div>
            </div>
        );
    }
}

manywho.component.register('GroupedCheckList', GroupedCheckList);