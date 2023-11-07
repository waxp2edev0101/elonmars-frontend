import PvpRoom from "../../component/Pvp/PvpRoom/PvpRoom";
import { getUnitDamage, getUnitHealth } from "../../utils/constants";
import { CREATE_ROOM_SUCCESS, ENEMY_CREATE_ROOM_SUCCESS, ENEMY_ENTER_ROOM_SUCCESS, ENEMY_SET_ABILITY_SUCCESS, ENEMY_SET_UNIT_SUCCESS, GET_BATTLE_DATA_SUCCESS, PvpState, SET_BATTLE_WINNER, UNIT_ATTACK_START, UNIT_ATTACK_END } from "./action-types";
import { GET_ROOM_LIST, ENTER_ROOM, ENTER_ROOM_SUCCESS, CHANGE_PVP_STATUS, SET_ABILITY_SUCCESS, SET_UNIT_SUCCESS, ATTACK_START, ATTACK_END, SET_MY_ADDRESS, CHANGE_TURN } from "./action-types";
import { DEFAULT_HP, PVP_ATTACK_TURN, PVP_STATUS } from "./constant";

const initialState: PvpState = {

  pvpRoom: {
    roomid: "",
    price: 0,
    localPlayer: {
      ready: false,
      ability: [],
      unit: "",
      attack: false,
      unitAttack: false,
      hp: DEFAULT_HP,
      unitHp: 500,
    },
    remotePlayer:{
      ready: false,
      address: "",
      ability: [],
      unit: "",
      attack: false,
      unitAttack: false,
      hp: DEFAULT_HP,
      unitHp: 500,
    }
  },

  roomDetail: {
    rooms: [],
    status: PVP_STATUS.SELECT_ROOM,
    myAddress: "",
    currentTurn: PVP_ATTACK_TURN.LOCAL_PLAYER,
    winner: ""
  },
  
};

export function pvpReducer(state = initialState, action: any): any {
  switch (action.type) {

    case SET_MY_ADDRESS: {
      const {address} = action.payload;
      const {roomDetail} = state;
      roomDetail.myAddress = address;
      return {...state};
    }

    case GET_ROOM_LIST: {
      const {rooms} = action.payload;
      const {roomDetail} = state;
      roomDetail.rooms = rooms;
      return {...state};
    }

    case CREATE_ROOM_SUCCESS: {
      const {room} = action.payload;
      const {pvpRoom, roomDetail} = state;
      console.log("entered room", room);

      pvpRoom.price = room.price;
      pvpRoom.roomid = room.roomid;

      roomDetail.status = PVP_STATUS.SELECT_UNIT;

      return {...state};
    }

    case ENTER_ROOM: {
      const {price} = action.payload;
      const {pvpRoom} = state;

      pvpRoom.price = price;
      return {...state};
    }

    case ENTER_ROOM_SUCCESS: {
      const {roomid, address} = action.payload;
      const {pvpRoom, roomDetail} = state;

      pvpRoom.roomid = roomid;
      if(roomid != address) {
        pvpRoom.remotePlayer.address = address;
      } 
      if(roomid != roomDetail.myAddress) {
        roomDetail.status = PVP_STATUS.SELECT_UNIT;
      }

      return {...state};
    }

    case CHANGE_PVP_STATUS: {
      const {status} = action.payload;
      const {roomDetail} = state;

      roomDetail.status = status;
      return {...state};
    }

    case SET_ABILITY_SUCCESS: {
      const {roomid, address, ability} = action.payload;
      const {pvpRoom, roomDetail} = state;

      console.log({roomid, address, ability});

      if(roomid === address) {
        pvpRoom.localPlayer.ability = ability;
        pvpRoom.localPlayer.ready = true;
        roomDetail.status = PVP_STATUS.WAITING;
      } else {
        pvpRoom.remotePlayer.ability = ability;
        
        roomDetail.status = PVP_STATUS.PLAY;
      }

      
  
      return {...state};
    }
    case SET_UNIT_SUCCESS: {
      const {roomid, address, unit} = action.payload;
      const {pvpRoom, roomDetail} = state;

      console.log({roomid, address, unit});

      if(roomid === address) {
        pvpRoom.localPlayer.unit = unit;
        pvpRoom.localPlayer.unitHp = getUnitHealth(unit);
      } else {
        pvpRoom.remotePlayer.unit = unit;
        pvpRoom.remotePlayer.unitHp = getUnitHealth(unit);
      }
      return {...state};
    }

    case ATTACK_START:{
      const {roomid, address, type, damage, health} = action.payload;
      const {pvpRoom, roomDetail} = state;

      console.log("remote player hp = ", pvpRoom.remotePlayer.unitHp, damage);

      if(roomid === address) {
        pvpRoom.localPlayer.attack = true;
        roomDetail.currentTurn = PVP_ATTACK_TURN.REMOTE_PLAYER;
        pvpRoom.localPlayer.hp = Math.min(1000, pvpRoom.localPlayer.hp + health);

        if(pvpRoom.remotePlayer.unitHp > 0) {
          pvpRoom.remotePlayer.unitHp = Math.max(0, pvpRoom.remotePlayer.unitHp - damage);
        } else {
          pvpRoom.remotePlayer.hp = Math.max(0, pvpRoom.remotePlayer.hp - damage);
        }

      } else {
        pvpRoom.remotePlayer.attack = true;
        roomDetail.currentTurn = PVP_ATTACK_TURN.LOCAL_PLAYER;
        pvpRoom.remotePlayer.hp = Math.min(1000, pvpRoom.remotePlayer.hp + health);


        if(pvpRoom.localPlayer.unitHp > 0) {
          pvpRoom.localPlayer.unitHp = Math.max(0, pvpRoom.localPlayer.unitHp - damage);
        } else {
          pvpRoom.localPlayer.hp = Math.max(0, pvpRoom.localPlayer.hp - damage);
        }
      }

      return {...state};
    }

    case ATTACK_END:{
      const {pvpRoom} = state;

      pvpRoom.localPlayer.attack = false;
      pvpRoom.remotePlayer.attack = false;

      return {...state};
    }

    case GET_BATTLE_DATA_SUCCESS: {
      const {data} = action.payload;
      const {pvpRoom} = state;

      pvpRoom.localPlayer.ability = data.localAbility;
      pvpRoom.localPlayer.unit = data.localUnit;
      pvpRoom.localPlayer.unitHp = getUnitHealth(data.localUnit);

      pvpRoom.remotePlayer.ability = data.remoteAbility;
      pvpRoom.remotePlayer.unit = data.remoteUnit;
      pvpRoom.remotePlayer.unitHp = getUnitHealth(data.remoteUnit);
      pvpRoom.remotePlayer.address = data.remoteAddress;

      pvpRoom.remotePlayer.ready = true;

      return {...state};
    }

    case CHANGE_TURN: {
      const {turn} = action.payload;
      const {roomDetail} = state;

      roomDetail.currentTurn = turn;

      return {...state};
    }

    case SET_BATTLE_WINNER: {
      const {winner} = action.payload;
      const {pvpRoom, roomDetail} = state;

      roomDetail.status = PVP_STATUS.END;
      roomDetail.winner = winner;
      roomDetail.currentTurn = "None";

      console.log("reducer", winner, pvpRoom.roomid);
      if(winner === pvpRoom.roomid){
        pvpRoom.remotePlayer.hp = 0;
        pvpRoom.remotePlayer.unitHp = 0;
      } else {
        pvpRoom.localPlayer.hp = 0;
        pvpRoom.localPlayer.unitHp = 0;
      }

      return {...state};
    }

    case UNIT_ATTACK_START: {
      const {roomid, address, type, damage, health} = action.payload;
      const {pvpRoom, roomDetail} = state;

      console.log('========================>', {roomid, address, type, damage, health}, pvpRoom.remotePlayer.unitHp);

      let {isBattle} = getUnitDamage(type);

      if(roomid === address) {
        
        pvpRoom.localPlayer.unitAttack = true;

        if(pvpRoom.remoteUnitHp === 0 || isBattle) {
          pvpRoom.remotePlayer.hp = Math.max(0, pvpRoom.remotePlayer.hp - damage);
        }
        pvpRoom.remotePlayer.unitHp = Math.max(0, pvpRoom.remotePlayer.unitHp - damage);

        console.log(pvpRoom.remotePlayer.unitHp);
        
        // pvpRoom.localPlayer.hp = Math.min(1000, pvpRoom.localPlayer.hp + health);


      } else {
        pvpRoom.remotePlayer.unitAttack = true;

        if(pvpRoom.localUnitHp === 0 || isBattle) {
          pvpRoom.localPlayer.hp = Math.max(0, pvpRoom.localPlayer.hp - damage);
        }
        pvpRoom.localPlayer.unitHp = Math.max(0, pvpRoom.localPlayer.unitHp - damage);

        // pvpRoom.remotePlayer.hp = Math.min(1000, pvpRoom.remotePlayer.hp + health);

      }

      return {pvpRoom, roomDetail};
    }

    case UNIT_ATTACK_END: {
      const {pvpRoom, roomDetail} = state;

      pvpRoom.localPlayer.unitAttack = false;
      pvpRoom.remotePlayer.unitAttack = false;

      return {...state};
    }

    ///////////////////// Enemy Actions /////////////////////
    default:
      return { ...state };
  }
}
