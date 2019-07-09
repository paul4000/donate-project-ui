import React from 'react';
import {Button, Form, Icon, Input, Select,  notification} from "antd";
import FormItem from "antd/es/form/FormItem";

import {getAllExecutorList} from '../common/RequestsHelper';

const Option = Select.Option;

class AddExecutorsComponent extends React.Component {

    constructor(props) {
        super(props);

        console.log(props);

        this.state = {
            chosenExecutors: [],
            executorsToChoose: [],
            currentExName: '',
            currentExAccount: '',
            currentAmount:{
                value: 0.0
            },
            leftDonation: props.amountOfDonation,
            processing : false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.addExecutor = this.addExecutor.bind(this);
        this.changeField = this.changeField.bind(this);
        this.filterExecutors = this.filterExecutors.bind(this);
        this.changeCurrentExecutor = this.changeCurrentExecutor.bind(this);
        this.checkIfProperAmount = this.checkIfProperAmount.bind(this);
        this.cannotAddExecutor = this.cannotAddExecutor.bind(this);
    }

    componentDidMount() {
        getAllExecutorList()
            .then(response => {
                this.setState({
                    executorsToChoose: response
                });
                console.log(response)
            }).catch(error => {
            notification.error({
                message: 'Donate App',
                description: error.message || 'Error occurred'
            });
        })
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({
            processing: true
        });

        this.props.handleSubmitExecutors(this.state.chosenExecutors);
    }

    filterExecutors(executor) {
        return executor.name === this.state.currentExName;
    }

    addExecutor(e) {

        e.preventDefault();

        console.log("Ex");
        console.log(this.state);

        let currentExecutors = this.state.chosenExecutors;

        //create new executor
        const eAddress = this.state.executorsToChoose.filter(this.filterExecutors)[0].address;
        const executor = {
            name: this.state.currentExName,
            address : eAddress,
            amount: this.state.currentAmount.value
        };

        currentExecutors.push(executor);

        const newLeftDonation = this.state.leftDonation - this.state.currentAmount.value;

        this.setState({
            chosenExecutors: currentExecutors,
            currentExName: '',
            currentExAccount: '',
            currentAmount: {
                value: 0.0
            },
            leftDonation: newLeftDonation
        });

    };

    changeField(e, f) {
        const target = e.target;
        const fieldName = target.name;
        const fieldValue = target.value;

        this.setState({
            [fieldName]: {
                value: fieldValue,
                ...f(fieldValue)
            },
        })
    }

    changeCurrentExecutor(value) {
        this.setState({
            currentExName: value
        })
    }

    checkIfProperAmount = (amount) => {

        if(amount <= 0) {
            return {
                result: 'error',
                msg: 'Amount has to be more than 0'
            };
        }

        if (amount <= this.state.leftDonation) {
            return {
                result: 'success'
            }
        } else {

            return {
                result: 'error',
                msg: 'Amount is bigger than left donation'
            }
        }
    };

    cannotAddExecutor() {
        return this.state.currentAmount.result === 'error';
    }

    cannotCloseAndOpen() {
        return this.cannotAddExecutor() || this.state.chosenExecutors.length < 1 || this.state.leftDonation > 0 || this.state.processing;
    }


    render() {
        const executorItems = (
            <div>
                {
                    this.state.chosenExecutors.map((ex) => (
                        <div>
                            {ex.name + " : " + ex.amount + " eth"}
                        </div>
                        )
                    )
                }
                <FormItem className="executor-details" validateStatus={this.state.currentAmount.result} help={this.state.currentAmount.msg}>
                    <Select name="currentExName" onChange={this.changeCurrentExecutor} defaultValue={this.state.currentExName}>
                        {
                            this.state.executorsToChoose.map((ex) => (
                                <Option key={ex.name} value={ex.name}>
                                    {ex.name}
                                </Option>
                            ))
                        }
                    </Select>
                    <Input type="text" name="currentAmount" placeholder="Enter donation amount"
                           value={this.state.currentAmount.value}
                           onChange={(event) => this.changeField(event, this.checkIfProperAmount)}/>
                </FormItem>
            </div>
        );

        return (
            <div className="executors-container">
                <h4>
                    { "Donation left : " + parseFloat(this.state.leftDonation) + " eth"}
                </h4>
                <Form onSubmit={this.handleSubmit}>
                    {executorItems}
                    <Button style={{ margin: "0px 10px 10px 10px"}} onClick={this.addExecutor} disabled={this.cannotAddExecutor()}>
                        <Icon type="plus"/> Add executor
                    </Button>
                    <Button style={{ margin: "0px 10px 10px 10px"}} type="primary" htmlType="submit" disabled={this.cannotCloseAndOpen()}>
                        <Icon type="play"/>CLOSE AND OPEN VALIDATION PHASE
                    </Button>
                </Form>
            </div>
        )
    }
}
export default AddExecutorsComponent;