<?xml version="1.0" encoding="UTF-8"?>
<Workflow xmlns="http://soap.sforce.com/2006/04/metadata">
    <fieldUpdates>
        <fullName>LeadStatusApptBooked</fullName>
        <description>Change Lead status to Appointment Booked</description>
        <field>Status</field>
        <literalValue>Appointment booked</literalValue>
        <name>LeadStatusApptBooked</name>
        <notifyAssignee>false</notifyAssignee>
        <operation>Literal</operation>
        <protected>false</protected>
    </fieldUpdates>
    <fieldUpdates>
        <fullName>Owner_Adam_Covey</fullName>
        <description>Owner Adam Covey</description>
        <field>OwnerId</field>
        <lookupValue>john@spscreens.com.au</lookupValue>
        <lookupValueType>User</lookupValueType>
        <name>Owner Adam Covey</name>
        <notifyAssignee>true</notifyAssignee>
        <operation>LookupValue</operation>
        <protected>false</protected>
    </fieldUpdates>
    <fieldUpdates>
        <fullName>Owner_Adam_Williams</fullName>
        <description>Owner Adam Williams</description>
        <field>OwnerId</field>
        <lookupValue>adam@spscreens.com.au</lookupValue>
        <lookupValueType>User</lookupValueType>
        <name>Owner Adam Williams</name>
        <notifyAssignee>true</notifyAssignee>
        <operation>LookupValue</operation>
        <protected>false</protected>
    </fieldUpdates>
    <fieldUpdates>
        <fullName>Owner_Chris_Noble</fullName>
        <field>OwnerId</field>
        <lookupValue>chris.noble@spscreens.com.au</lookupValue>
        <lookupValueType>User</lookupValueType>
        <name>Owner Chris Noble</name>
        <notifyAssignee>true</notifyAssignee>
        <operation>LookupValue</operation>
        <protected>false</protected>
        <reevaluateOnChange>true</reevaluateOnChange>
    </fieldUpdates>
    <fieldUpdates>
        <fullName>Owner_Craig_Howe</fullName>
        <field>OwnerId</field>
        <lookupValue>craigh@spscreens.com.au</lookupValue>
        <lookupValueType>User</lookupValueType>
        <name>Owner Craig Howe</name>
        <notifyAssignee>true</notifyAssignee>
        <operation>LookupValue</operation>
        <protected>false</protected>
        <reevaluateOnChange>true</reevaluateOnChange>
    </fieldUpdates>
    <fieldUpdates>
        <fullName>Owner_David_Spencer</fullName>
        <description>Owner David Spencer</description>
        <field>OwnerId</field>
        <lookupValue>david.spencer@spscreens.com.au</lookupValue>
        <lookupValueType>User</lookupValueType>
        <name>Owner David Spencer</name>
        <notifyAssignee>true</notifyAssignee>
        <operation>LookupValue</operation>
        <protected>false</protected>
    </fieldUpdates>
    <fieldUpdates>
        <fullName>Owner_John_Bateman</fullName>
        <description>Owner John Bateman</description>
        <field>OwnerId</field>
        <lookupValue>john.bateman@spscreens.com.au</lookupValue>
        <lookupValueType>User</lookupValueType>
        <name>Owner John Bateman</name>
        <notifyAssignee>true</notifyAssignee>
        <operation>LookupValue</operation>
        <protected>false</protected>
    </fieldUpdates>
    <fieldUpdates>
        <fullName>Owner_John_Hemming</fullName>
        <field>OwnerId</field>
        <lookupValue>john@spscreens.com.au</lookupValue>
        <lookupValueType>User</lookupValueType>
        <name>Owner John Hemming</name>
        <notifyAssignee>true</notifyAssignee>
        <operation>LookupValue</operation>
        <protected>false</protected>
    </fieldUpdates>
    <fieldUpdates>
        <fullName>Owner_Keith_Kelman</fullName>
        <description>Owner Keith Kelman</description>
        <field>OwnerId</field>
        <lookupValue>keith.kelman@spscreens.com.au</lookupValue>
        <lookupValueType>User</lookupValueType>
        <name>Owner Keith Kelman</name>
        <notifyAssignee>true</notifyAssignee>
        <operation>LookupValue</operation>
        <protected>false</protected>
    </fieldUpdates>
    <rules>
        <fullName>Lead Status</fullName>
        <actions>
            <name>LeadStatusApptBooked</name>
            <type>FieldUpdate</type>
        </actions>
        <active>true</active>
        <criteriaItems>
            <field>Lead.Referred_By__c</field>
            <operation>equals</operation>
            <value>SKEDULE.ME</value>
        </criteriaItems>
        <description>Make Lead Status &quot;Appointment Booked&quot; if lead is from Skedule.ME</description>
        <triggerType>onCreateOnly</triggerType>
    </rules>
    <rules>
        <fullName>Owner Adam Williams</fullName>
        <actions>
            <name>Owner_Adam_Williams</name>
            <type>FieldUpdate</type>
        </actions>
        <active>true</active>
        <criteriaItems>
            <field>Lead.Sales_Rep__c</field>
            <operation>equals</operation>
            <value>Adam Williams</value>
        </criteriaItems>
        <description>Owner Adam Williams</description>
        <triggerType>onCreateOrTriggeringUpdate</triggerType>
    </rules>
    <rules>
        <fullName>Owner Chris Noble</fullName>
        <actions>
            <name>Owner_Chris_Noble</name>
            <type>FieldUpdate</type>
        </actions>
        <active>true</active>
        <criteriaItems>
            <field>Lead.Sales_Rep__c</field>
            <operation>equals</operation>
            <value>Chris Noble</value>
        </criteriaItems>
        <description>Owner Chris Noble</description>
        <triggerType>onCreateOrTriggeringUpdate</triggerType>
    </rules>
    <rules>
        <fullName>Owner Craig Howe</fullName>
        <actions>
            <name>Owner_Craig_Howe</name>
            <type>FieldUpdate</type>
        </actions>
        <active>true</active>
        <criteriaItems>
            <field>Lead.Sales_Rep__c</field>
            <operation>equals</operation>
            <value>Craig Howe</value>
        </criteriaItems>
        <description>Owner Craig Howe</description>
        <triggerType>onCreateOrTriggeringUpdate</triggerType>
    </rules>
    <rules>
        <fullName>Owner David Spencer</fullName>
        <actions>
            <name>Owner_David_Spencer</name>
            <type>FieldUpdate</type>
        </actions>
        <active>true</active>
        <criteriaItems>
            <field>Lead.Sales_Rep__c</field>
            <operation>equals</operation>
            <value>David Spencer</value>
        </criteriaItems>
        <description>Owner David Spencer</description>
        <triggerType>onCreateOrTriggeringUpdate</triggerType>
    </rules>
    <rules>
        <fullName>Owner John Bateman</fullName>
        <actions>
            <name>Owner_John_Bateman</name>
            <type>FieldUpdate</type>
        </actions>
        <active>true</active>
        <criteriaItems>
            <field>Lead.Sales_Rep__c</field>
            <operation>equals</operation>
            <value>John Bateman</value>
        </criteriaItems>
        <description>Owner ohn Bateman</description>
        <triggerType>onCreateOrTriggeringUpdate</triggerType>
    </rules>
    <rules>
        <fullName>Owner John Hemming</fullName>
        <actions>
            <name>Owner_John_Hemming</name>
            <type>FieldUpdate</type>
        </actions>
        <active>true</active>
        <criteriaItems>
            <field>Lead.Sales_Rep__c</field>
            <operation>equals</operation>
            <value>John Hemming</value>
        </criteriaItems>
        <description>Owner John Hemming</description>
        <triggerType>onCreateOrTriggeringUpdate</triggerType>
    </rules>
    <rules>
        <fullName>Owner Keith Kelman</fullName>
        <actions>
            <name>Owner_Keith_Kelman</name>
            <type>FieldUpdate</type>
        </actions>
        <active>true</active>
        <criteriaItems>
            <field>Lead.Sales_Rep__c</field>
            <operation>equals</operation>
            <value>Keith Kelman</value>
        </criteriaItems>
        <description>Owner Keith Kelman</description>
        <triggerType>onCreateOrTriggeringUpdate</triggerType>
    </rules>
</Workflow>
