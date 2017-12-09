import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Collapsible, CollapsibleItem, Card, CardTitle, Collection, CollectionItem } from 'react-materialize';

//from list
import StockCryptoTracker from '../components/stockcrypto_tracker';
import PortfolioValue from '../components/PortfolioValue';
import { addTicker, loadTickerList, loadTickerPrices, removeTicker, loadChartData, updateQuantity } from '../actions/index';
import { TYPE } from '../actions/types';
import _ from 'lodash';
import { Row, Col, Preloader, Table } from 'react-materialize';


class SideBarNav extends Component {
  constructor(props) {
     super(props);

     this.renderTrackerList = this.renderTrackerList.bind(this);
     this.renderTracker = this.renderTracker.bind(this);
     this.loadTickerPrices = this.loadTickerPrices.bind(this);
  }

  async componentDidMount() {
     await this.props.loadTickerList();
     await this.props.loadTickerPrices();
     const { name, type } = this.props.tickerList[0];
     this.props.updateGraphTicker({ name, type });
  }

  handleRemoveClick( _id ) {
     this.props.removeTicker(_id);
  }

  returnProgress(){
    return (<Row> <Col> <Preloader size='small'/> </Col> </Row>);
  }

  renderTracker (tickerItem, renderType) {
     const { name, type, quantity } = tickerItem;

     if ( type === renderType ) {
        const key = name + '-' + type;
       console.log('tickerItem = ', tickerItem);

       let currentPrice = _.get(this.props.priceList, `[${type}][${name}]`, '');

        if (currentPrice != '') {
           currentPrice = Number(currentPrice).toFixed(2);
           currentPrice = '$' + this.numberWithCommas(currentPrice);
        }
        else {
          currentPrice = this.returnProgress();
        }

       let chartData = _.get(this.props.chartData, `[${type}][${name}]`, {prices: [0], times:[0] } );

       return (
          <li class="collection-item">
            <StockCryptoTracker key={key} name={name} type={type} currentPrice={currentPrice} quantity={quantity}
               updateQuantity={this.props.updateQuantity} chartData={chartData}
               onClick={this.props.removeTicker} updateGraphTicker={this.props.updateGraphTicker}/>
         </li>);
     }


  }

  numberWithCommas(x) {
     return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  renderTrackerList (renderType) {
     console.log('renderType = ', renderType);
     return (
        <div className="black-text">
           <ul class="collection">
	             <li class="collection-item">
                   <Row>
                     <Col s={2}>Ticker</Col><Col className='price-text' s={3}>Price</Col><Col s={2}><div className='quantity-text'>Quantity</div></Col>
                   </Row>
                </li>
                 {this.props.tickerList.map( ticker => this.renderTracker(ticker, renderType))}
            </ul>
        </div>
    )
  }

  loadTickerPrices() {
     this.props.loadTickerPrices();
  }

  renderName() {
    const { auth } = this.props;
    if (auth) {
      return auth.displayName;
    }
    return 'Welcome';
  }


  render() {
    return(

      <ul id="nav-mobile" className="side-nav fixed z-depth-8">
        <Card className='navbar-img'
        	header={<CardTitle image={require('../img/a.jpg')}>{this.renderName()}</CardTitle>}>
         <PortfolioValue tickerList={this.props.tickerList} priceList={this.props.priceList} />
        </Card>
        <Collapsible className='ticker-collasp'>
        	<CollapsibleItem id="collapsible-header" className="white-text z-depth-6" header='Stocks' icon='trending_up'>
            {this.renderTrackerList(TYPE.STOCK)}
        	</CollapsibleItem>
        	<CollapsibleItem id="collapsible-header" className="white-text z-depth-6" header='Crypto Currencies' icon='trending_up'>
            {this.renderTrackerList(TYPE.CRYPTO)}
          </CollapsibleItem>
        </Collapsible>
      </ul>
    );
  }
}

function mapStateToProps({tickerList, priceList, auth}){
   return { tickerList, priceList, auth }
}

function mapDispatchToProps(dispatch) {
   return bindActionCreators({ loadTickerList, loadTickerPrices, removeTicker, updateQuantity }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBarNav);