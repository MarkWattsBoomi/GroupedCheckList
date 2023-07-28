import { eLoadingState, FlowComponent, FlowField, FlowObjectDataArray, FlowOutcome} from "flow-component-model";
import React, { CSSProperties } from "react";
import "./GroupedCheckList.css";
import { FCMModal } from "fcmkit";
import { oObject, oObjectConf, oObjects } from "./ObjectModel";
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
        this.itemClicked = this.itemClicked.bind(this);
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
        conf.clickEnableAttribute = this.getAttribute("clickEnableAttribute");
        conf.displayColumns = this.model.displayColumns;
        let onClickName: string = this.getAttribute("onClickOutcome");
        if(onClickName && onClickName.length>0){
            let onClick: FlowOutcome = this.outcomes[onClickName];
            if(onClick) {
                conf.onClickOutcome = onClick;
            }
        } 
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

    async itemClicked(internalId: string) {
        let item: oObject = this.projects.getObject(internalId);
        // store item into row level state if defined
        if (item && this.getAttribute('rowLevelState', '').length > 0) {
            const val: FlowField = await this.loadValue(this.getAttribute('rowLevelState'));
            if (val) {
                val.value = item.objectData;
                await this.updateValues(val);
            }
        }
        let outcome: FlowOutcome = this.projects.conf.onClickOutcome;
        if(outcome) {
            if(item){
                if(outcome.attributes["uri"]?.value?.length > 0){
                    //we are going to open a new tab
                    let uri: string = outcome.attributes["uri"].value;
                    let match: any;
                    while (match = RegExp(/{{([^}]*)}}/).exec(uri)) {
                        const prop: string = item.attributes.get(match[1].replace('&amp;', '&')).getDisplayString();
                        uri = uri.replace(match[0], prop);
                    }
                    if(uri && uri.length> 0){
                        const tab = window.open('');
                        if (tab) {
                            tab.location.href = uri;
                        } else {
                            console.log('Couldn\'t open a new tab');
                        }
                    }
                    else {
                        console.log('No uri value on row');
                    }
                }
                else {
                    await this.triggerOutcome(outcome.developerName);
                    // we are going to store the item & trigger the outcome
                }
            }
        }
        else{
            if(this.model.hasEvents) {
                await manywho.engine.sync(this.flowKey);
            }
        }
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