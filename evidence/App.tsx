import React, {useState} from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {useStyles as beforeStyles} from './ciceroneBefore/components/Spotlight/styles';
import {useStyles as afterStyles} from './ciceroneAfter/components/Spotlight/styles';
import {useStyles as beforeCard} from './ciceroneBefore/components/TourCard/styles';
import {useStyles as afterCard} from './ciceroneAfter/components/TourCard/styles';
import {DEFAULT_THEME} from './ciceroneBefore/constants/DEFAULT_THEME';
import {useSpotlightViewModel} from './ciceroneBefore/components/Spotlight/hooks/useSpotlightViewModel';
type Mode='next'|'skip'|'none';
function Case({patched,mode}:{patched:boolean,mode:Mode}){
  const [overlay,setOverlay]=useState(0),[background,setBackground]=useState(0),[height,setHeight]=useState(0),[gradient,setGradient]=useState(0);
  const styles=(patched?afterStyles:beforeStyles)(DEFAULT_THEME);
  const card=(patched?afterCard:beforeCard)(DEFAULT_THEME.highlight);
  const model=useSpotlightViewModel({geometry:{hole:{x:20,y:20,width:40,height:40},holeRadius:0,ring:{x:20,y:20,width:40,height:40},ringRadius:0},theme:DEFAULT_THEME,isHighlight:false,isExiting:false,screen:{width:340,height:170},overlayPress:mode,allowTargetInteraction:false,onPress:()=>setOverlay(x=>x+1)});
  return <View style={s.card}>
    <Text style={s.heading}>{patched?'AFTER':'BEFORE'}</Text>
    <View style={s.stage}>
      <Pressable style={StyleSheet.absoluteFill} onPress={()=>setBackground(x=>x+1)}><Text style={s.target}>Background action</Text></Pressable>
      <View pointerEvents="none" style={[StyleSheet.absoluteFill,{backgroundColor:'#00000050'}]}/>
      <View style={styles.root} pointerEvents="box-none" onLayout={e=>setHeight(e.nativeEvent.layout.height)}>
        {model.isPressable&&<Pressable style={styles.root} onPress={model.handlePress}/>}
      </View>
    </View>
    <Text style={s.metric}>Overlay root: {height.toFixed(0)} dp / stage: 170 dp</Text>
    <Text style={s.metric}>Overlay taps: {overlay} | Background actions: {background}</Text>
    <View style={s.sample}>
      <View style={[card.gradient,{backgroundColor:'#65cba0'}]} onLayout={e=>setGradient(e.nativeEvent.layout.height)}/>
    </View>
    <Text style={s.metric}>Card gradient: {gradient.toFixed(0)} dp / card: 30 dp</Text>
  </View>;
}
export default function App(){const [mode,setMode]=useState<Mode>('next');return <View style={s.page}>
  <Text style={s.title}>Cicerone overlay hit area</Text>
  <Text style={s.metric}>RN 0.87.1 / Android API 35 / Fabric</Text>
  <Text style={s.metric}>Focused native style + view-model fixture</Text>
  <View style={s.buttons}>{(['next','skip','none'] as Mode[]).map(m=><Pressable key={m} onPress={()=>setMode(m)} style={[s.button,m===mode&&s.active]}><Text style={s.heading}>{m}</Text></Pressable>)}</View>
  <Case patched={false} mode={mode}/><Case patched mode={mode}/>
</View>}
const s=StyleSheet.create({page:{flex:1,padding:18,paddingTop:48,backgroundColor:'#101827'},title:{fontSize:23,fontWeight:'700',color:'white'},metric:{fontSize:12,color:'#dae8f7',marginTop:7},heading:{fontSize:16,color:'white',fontWeight:'700'},card:{padding:12,backgroundColor:'#24344a',marginTop:16,borderRadius:12},stage:{height:170,marginTop:12,backgroundColor:'#8c4862'},target:{padding:20,color:'white',fontSize:16},sample:{height:30,marginTop:12,backgroundColor:'#82566c'},buttons:{flexDirection:'row',gap:12,marginTop:12},button:{padding:8,backgroundColor:'#37465c'},active:{backgroundColor:'#267c69'}});
