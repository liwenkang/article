import { Injectable } from '@nestjs/common';
import ResourceStatusDto from './dtos/ResourceStatusDto';

@Injectable()
export default class DynamicResourceAllocationService {
  public Login(res, userInfoDto): any {
    // tslint:disable-next-line:no-console
    console.log('userInfoDto', userInfoDto);
    if (userInfoDto.username === '123' && userInfoDto.password === '123') {
      res.send(userInfoDto);
    } else {
      res.status(401).send('用户名或者密码错误');
    }
  }

  public GetNetworkTree(): any {
    return [{
      taskID: '爆炸',
      taskName: 'TDMA保障任务',
      taskNets: [{
        // todo 我需要一个字段来标识这个网系的类型 比如 netType
        // 暂定 type NetType = 'TDMA' | 'FDMA' | 'UHF战术' | 'UHF手持' | '应急网' | '干线网' | '支线网' | undefined;
        netType: 'TDMA',
        systemID: 7,
        netNo: 12,
        netName: 'TDMA网1',
        // 网络状态
        netStatus: '网络状态',
        // 网络状态描述
        netStatusDes: '网络状态描述',
      }],
    }];
  }

  // 2.1.2.	资源池状态查询
  public ResourceStatus(ResourceStatus: ResourceStatusDto): any {
    return [];
  }

  // 2.1.3.	转发器铰链关系
  public TspdRelation(): any {
    return [];
  }

  // 2.2.1.	网络监视列表查询
  public netparamlist(): any {
    return [{
      tasknetlist: {
        taskID: '任务标识111',
        taskName: '任务名称',
        netNo: '网号',
        netName: '网络名称',
        systemID: '网络类型',
        NetPlanResult: '参数规划结果',
        NetPlanVersion: '网络参数版本',
        NetScheResult: '组网下发结果',
        NetStartTime: '组网成功时间',
        netStatusDes: '网络状态描述',
        VerEndClause: '终止原因',
        AdvanceID: '调配建议号',
        Createtime: '建议生成时间',
        Period: '调整周期',
        Exclute: '执行情况',
      },
      advanceDetail: [
        {
          SatID: '卫星编号',
          BeamID: '波束编号',
          UpTspdID: '转发器编号',
          CarrID: '载波编号',
          CarrType: '载波类型',
          AdType: '建议类别',
          AdValue: '建议值',
          Selected: '选中',
        },
      ],
      resourceConf: [{
        SatID: '卫星编号',
        BeamID: '波束编号',
        UpTspdID: '转发器编号',
        CarrID: '载波编号',
        CarrType: '载波类型',
        StartFreq: '起始频点',
        EndFreq: '结束频点',
        BandWidth: '带宽',
      }],
    }];
  }

  // 2.2.1.2.	网络详情
  public netparamdetail(): any {
    return [{
      taskID: '任务标识',
      taskName: '任务名称',
      TaskUnit: '任务单位',
      StartTime: '开始时间',
      EndTime: '结束时间',
      Priority: '任务优先级',
      netNo: '网号',
      netName: '网络名称',
      systemID: '网络类型',
      netStatus: '网络状态',
      NetPlanResult: '参数规划结果',
      NetScheResult: '组网下发结果',
      NetStartTime: '组网成功时间',
      netStatusDes: '网络状态描述',
      VerEndClause: '终止原因',
      AdvanceID: '调配建议号',
      Createtime: '建议生成时间',
      Period: '调整周期',
      Exclute: '执行情况',
      advanceDetail: [{
        SatID: '卫星编号',
        BeamID: '波束编号',
        UpTspdID: '转发器编号',
        CarrID: '载波编号',
        CarrType: '载波类型',
        AdType: '建议类别',
        AdValue: '建议值',
        Selected: '选中',
      }],
      resourceConf: [{
        SatID: '卫星编号',
        BeamID: '波束编号',
        UpTspdID: '转发器编号',
        CarrID: '载波编号',
        CarrType: '载波类型',
        StartFreq: '起始频点',
        EndFreq: '结束频点',
        BandWidth: '带宽',
      }],
    }];
  }

  // 2.2.1.3.	调配建议保存
  public savenetadjustadvances(): any {
    return {
      Result: 1,
      Description: '成功',
    };
  }

  // 2.2.2.	资源调整规划
  public netadjustplan(): any {
    return {
      Result: 1,
      Description: '成功',
    };
  }

  // 2.2.3.	资源配置下发
  public NetworkConfDeploy(): any {
    return {
      Result: 1,
      Description: '成功',
    };
  }

  // 2.3.1.1.	访问方法
  public NetAdjustDesisonRuleReq(): any {
    return [{
      ParamType: '参数类别',
      ParamTypeName: '参数类别名称',
      ParaId: '参数编号',
      Paraname: '字段名称',
      Selected: '选中',
      thresholdProperty: '阈值参数属性',
      ValueList: '阈值参数可能取值范围',
      MinparamValue: '阈值参数最小值',
      MaxparamValue: '阈值参数最大值',
      FreqPercent: '频度',
    }];
  }

  // 2.3.2.	调配判据保存
  public NetAdjustDesisonRuleSave(): any {
    return {
      Result: 1,
      Description: '成功',
    };
  }

  // 2.3.3.1.	访问方法
  public NetAdjustDefaltRuleReq(): any {
    return [{
      NetType: 1,
      MainCarrAdjOption: 1,
      MainCarrLocRule: 1,
      MainCarrLocValue: 1,
      MainCarrAsianRule: 1,
      TraficCarrAdjOption: 1,
      TraficCarrLocRule: 1,
      TraficCarrLocValue: 1,
      TraficCarrAsianRule: 1,
      ResAutoReqOption: 1,
      AdjFreq: 1,
    }];
  }

  // 2.3.4.	调配规则修改
  public NetAdjustDefaltRuleSave(): any {
    return {
      Result: 1,
      Description: '成功',
    };
  }

  // 2.3.5.	任务网络调配规则查询
  public NetAdjustRuleReq(): any {
    return {
      TaskID: 0,
      NetNo: '网络编号 NetNo',
      NetType: 1,
      AdjustOption: 0,
      MainCarrAdjOption: 1,
      MainCarrLocRule: 1,
      MainCarrLocValue: 1,
      MainCarrAsianRule: 1,
      TraficCarrAdjOption: 1,
      TraficCarrLocRule: 1,
      TraficCarrLocValue: 1,
      TraficCarrAsianRule: 1,
      ResAutoReqOption: 1,
      AdjFreq: 1,
      LstPeriodAnalyseTime: '2015/01/03',
      LstAdjustAnalyseTime: '2015/02/03',
    };
  }

  // 2.3.6.	任务网络调配规则修改
  public NetAdjustRuleSave(): any {
    return {
      Result: 1,
      Description: '成功',
    };
  }

  // 2.4.1.	资源申请任务查询
  public SatResourceReqTask(): any {
    return [{
      ReqID: '请求编号',
      ReqName: '请求名称',
      Starttime: '2015/01/03',
      EndTime: '2015/02/03',
      TaskStatus: '任务状态',
    }];
  }

  // 2.4.2.	资源申请任务添加
  public SatResourceReqAdd(): any {
    return {
      Result: 1,
      Description: '成功',
    };
  }

  // 2.5.1.	系统维护任务查询
  public MaintenanceTask(): any {
    return [{
      ReqID: '请求编号',
      ReqName: '请求名称',
      ReqType: '网系维护',
      UserID: '用户ID',
      UserName: '用户名称',
      Starttime: '2015/01/03',
      EndTime: '2015/02/03',
      TaskStatus: '任务状态',
      taskID: 0,
      netNo: 0,
      Operate: 0,
      RelationTarget: '初始化域成功',
    }, {
      ReqID: '请求编号',
      ReqName: '请求名称',
      ReqType: '设备维护',
      UserID: '用户ID',
      UserName: '用户名称',
      Starttime: '2015/01/03',
      EndTime: '2015/02/03',
      TaskStatus: '任务状态',
      EquipmentID: 0,
      netNo: 0,
      Operate: 0,
      RelationTarget: '初始化域成功',
    }];
  }

  // 2.5.2.	网系维护任务添加
  public NetMaintenanceAdd(): any {
    return {
      Result: 1,
      Description: '成功',
    };
  }

  // 2.5.3.	设备维护任务添加
  public EquipmentMaintenanceTaskAdd(): any {
    return {
      Result: 1,
      Description: '成功',
    };
  }

  // 2.5.4.	网络事件查询
  public NetworkMessageReq(): any {
    return [{
      TaskID: '任务ID',
      TaskName: '任务名称',
      NetNo: '网络ID',
      NetName: '网络名称',
      MessageID: '事件ID',
      MessageName: '事件名称',
      Time: '时间',
      Description: '描述',
    }];
  }
}
