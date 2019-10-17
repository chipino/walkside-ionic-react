import * as React from 'react';
import ReactMapboxGl, { GeoJSONLayer } from 'react-mapbox-gl';
import * as MapboxGL from 'mapbox-gl';
import WalksideAPI from 'axios'

// tslint:disable-next-line:no-var-requires
// const { token, styles } = require('./config.json');
// tslint:disable-next-line:no-var-requires
// import geojson from './geojson.json'

const Map = ReactMapboxGl({ accessToken: 'pk.eyJ1IjoidmFuY2YiLCJhIjoiY2luYnA4NjYyMG55OXRxbHd4NG9za2NlbyJ9.D7skb_oaV4NV8zQDi6AzaQ' });

const mapStyle = {
  flex: 1,
  overflow: "visible",
  height: "93vh"
};

const symbolLayout: MapboxGL.SymbolLayout = {
  'text-field': '{place}',
  'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
  'text-offset': [0, 0.6],
  'text-anchor': 'top'
};
const symbolPaint: MapboxGL.SymbolPaint = {
  'text-color': 'white'
};

const lineLayout: MapboxGL.LineLayout = {
  'line-cap': 'round' as 'round',
  'line-join': 'round' as 'round'
};

const linePaint: MapboxGL.LinePaint = {
  'line-color': '#4790E5',
  'line-width': 1
};

export interface Props {
  // tslint:disable-next-line:no-any
  onStyleLoad?: (map: any) => any;
}

export interface IState {
  geojson?: string;
}

class GeoJsonLayer extends React.Component<Props, IState> {
  
  constructor(props: Props) {
    super(props);
    this.state = { 
      geojson: '' 
    };
  }
  
  private center = [-123.120735, 49.282730] as [number, number];

  // tslint:disable-next-line:no-any
  private onClickCircle = (evt: any) => {
    console.log(evt);
  };

  // tslint:disable-next-line:no-any
  private onStyleLoad = (map: any) => {
    const { onStyleLoad } = this.props;
    return onStyleLoad && onStyleLoad(map);
  };

  private onGeoLoad = () => {
    WalksideAPI.get("https://walkside-api.herokuapp.com/walkside").then((result) => {    
      console.log(result.data)
      this.setState({ geojson: result.data});
    }) 
  }

  private toggleMap = () => {
    if(this.state.geojson === ''){
      return false
    }
    else{
      return true
    }
  }

  componentDidMount() {
    this.onGeoLoad()
  }

  public render() {
    return (
      this.toggleMap() &&
      <Map
        style="mapbox://styles/mapbox/streets-v11"
        center={this.center}
        containerStyle={mapStyle}
        onStyleLoad={this.onStyleLoad}
      >
        <GeoJSONLayer
          data={this.state.geojson}
          lineLayout={lineLayout}
          linePaint={linePaint}
          circleOnClick={this.onClickCircle}
          symbolLayout={symbolLayout}
          symbolPaint={symbolPaint}
        />
      </Map>
    );
  }
}

export default GeoJsonLayer;