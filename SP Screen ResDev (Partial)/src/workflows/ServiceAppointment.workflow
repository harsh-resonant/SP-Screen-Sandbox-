<?xml version="1.0" encoding="UTF-8"?>
<Workflow xmlns="http://soap.sforce.com/2006/04/metadata">
    <fieldUpdates>
        <fullName>Set_Subject</fullName>
        <field>Subject</field>
        <formula>Subject_Formula__c</formula>
        <name>Set Subject</name>
        <notifyAssignee>false</notifyAssignee>
        <operation>Formula</operation>
        <protected>false</protected>
    </fieldUpdates>
    <rules>
        <fullName>Change Subject</fullName>
        <actions>
            <name>Set_Subject</name>
            <type>FieldUpdate</type>
        </actions>
        <active>true</active>
        <formula>DATEVALUE(CreatedDate) =  Today() || DATEVALUE( LastModifiedDate ) = TODAY()</formula>
        <triggerType>onAllChanges</triggerType>
    </rules>
</Workflow>
