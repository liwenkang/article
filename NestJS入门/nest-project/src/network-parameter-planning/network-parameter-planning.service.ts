import { Injectable } from '@nestjs/common';

// 在这里写详细的业务代码
@Injectable()
export class NetworkParameterPlanningService {
  public GetNetworkTree(res): any {
    res.json([{
      taskID: 123,
      taskName: 'TDMA保障任务',
      taskNets: [{
        // todo 我需要一个字段来标识这个网系的类型 比如 netType
        // 暂定 type NetType = 'TDMA' | 'FDMA' | 'UHF战术' | 'UHF手持' | '应急网' | '干线网' | '支线网' | undefined;
        netType: 'TDMA',
        systemID: 7,
        netNO: 12,
        netName: 'TDMA网1',
        // todo 所有关于版本 confVersions 以及配置状态 confStatus 的信息都移到右侧表格中显示
      }],
    }]);
  }

  public GetNetworkConfParams(res): any {
    res.json({
      confVersions: [
        // todo 默认 confVersions 第一项是最新的,或者加个标识
        {
          // 版本名称 √
          confVersion: 12312312,
          // timeSpan 表示该配置的下发和被替换时间 √
          name: '2012-01-02 08:03:12 至 2012-01-02 08:03:12',
          // 配置状态 待开网、已下发、执行中、已终止 √
          confStatus: '待开网',
          // 配置文件类型 √
          configFileType: 'xxx',
          // 配置生成时间 √
          configurationGenerationTime: '2019-6-21 10:57:06',
          // 这里是之前的 tdmaOut(之后不管什么网系,全部在这里输出) √
          data: {
            // 基本信息 √
            taskInfo: {
              satID: 5,
              satName: '神通二号02星',
              // 业务量满足情况比例 [0-100]
              efficiency: 100,
              ucode: 12,
              // 用户单位
              userName: '海军',
              startDate: '2019-01-02 09:00:00',
              endDate: '2019-03-02 09:00:00',
            },
            // 网控中心 √
            nccInfo: {
              nccId: 1,
              nccName: '北京网控中心',
              ip: '10.65.39.124:2000',
              // 网控中心角色
              role: 1,
            },
            netParamBean: {
              // 组网参数 √
              netParam: {
                // tdma 组网模式 网状网 星状网
                networkType: 1,
                // 组网规模
                networkSize: 10,
                // 中频频段
                intermediateFreqBand: 1,
                // 信噪比门限（高）
                en_ThresholdHigh: 160,
                // 信噪比门限（中）
                en_ThresholdMiddle: 120,
                // 信噪比门限（低）
                en_ThresholdLow: 100,
                // 参考Eb/N0补偿因子
                en_Compensate: 0,
                // 主站终端能力 一主一备 一主多备
                multi_CCU_Enb: 0,
              },
              // 帧结构参数 √
              frameStruct: {
                // 帧长度
                frameLen: 11100,
                // 超帧长度
                superFrameLen: 1,
                // 参考时隙编号
                refTimeSlotId: 0,
                // 突发保护时间
                burstProtectTime: 200,
                // 基本数据时隙长度
                dataTimeSlotLength: 100,
                // 帧保护时间
                frameProtectTime: 200,
              },
              // 子帧参数 √
              lsSubFrames: [{
                // 子帧标识
                'subFrameId': 1,
                // 波束号
                'beamNo': 1,
                'beamName': '波束1',
                // 基本时隙数
                ' basicSlotNum': 4,
                // 子帧号
                'SEQ_NO': 1,
              },
                {
                  // 子帧标识
                  'subFrameId': 2,
                  // 波束号
                  'beamNo': 2,
                  'beamName': '波束2',
                  // 基本时隙数
                  ' basicSlotNum': 4,
                  // 子帧号
                  'SEQ_NO': 2,
                },
              ],
              // todo 这里写到参考载波参数里了,没有考虑业务载波
              lsCarrierParams: [{
                // 载波数据唯一标识
                sid: 1,
                // 载波标识
                carrierId: 1,
                // 子帧标识
                subFrameId: 1,
                // 源波束号
                sourceBeamId: 2,
                sourceBeamName: '源波束',
                // 目的波束号
                desBeamId: 3,
                desBeamName: '目的波束',
                // 上行转发器号
                upTspdId: 11,
                upTspdName: '上行转发器',
                // 发送射频频率
                upFreq: 14110123,
                // 接收射频频率
                downFreq: 2132324,
                // 载波速率
                carrierSpeedBps: 2048000,
                // 编码方式
                codeType: 1,
                // 数据时隙因子
                dataTimeSlot: 2,
                // 参考载波标识
                refCarrierFlag: 1,
                // 是否是载波组，1：是；0：否
                isGroup: 1,
                // 扩频比一
                spreadFactor1: 1,
                // 扩频一的数量
                subCarrierNum1: 4,
                // 规划时的载波类型
                carrierType: 1,
                carrierTypeName: '参考载波',
              },
                {
                  // 载波数据唯一标识
                  sid: 2,
                  // 载波标识
                  carrierId: 2,
                  // 子帧标识
                  subFrameId: 1,
                  // 源波束号
                  sourceBeamId: 2,
                  sourceBeamName: '源波束',
                  // 目的波束号
                  desBeamId: 3,
                  desBeamName: '目的波束',
                  // 上行转发器号
                  upTspdId: 11,
                  upTspdName: '上行转发器',
                  // 发送射频频率
                  upFreq: 14111123,
                  // 接收射频频率
                  downFreq: 2134324,
                  // 载波速率
                  carrierSpeedBps: 2048000,
                  // 编码方式
                  codeType: 1,
                  // 数据时隙因子
                  dataTimeSlot: 2,
                  // 参考载波标识
                  refCarrierFlag: 1,
                  // 是否是载波组，1：是；0：否
                  isGroup: 1,
                  // 扩频比一
                  spreadFactor1: 1,
                  // 扩频一的数量
                  subCarrierNum1: 4,
                  // 规划时的载波类型
                  carrierType: 2,
                  carrierTypeName: '业务载波',
                },
              ],
              // todo 不知道是啥
              lsRefCarrierParams: [{
                carrierSid: 1,
              }],
              // todo 要不要显示?
              // 反向载波数据 只有当netType 为星状网时有效
              lsReverseCarrierParams: [{
                carrierSid: 1,
                // 反向载波组标识
                reversionCarrierGroupId: 1,
              }],
              // 终端控制参数 √
              lsTermCtrls: [{
                // 终端地址
                terminalAddr: 1,
                // 入网权限
                privilege: 1,
                // 值守载波1
                carrier1Id: 1,
                // 值守载波2
                carrier2Id: 0,
                // 站能力
                terminalProperty: 1,
                // 值守分帧
                stationGroup: 63,
              },
                {
                  // 终端地址
                  terminalAddr: 2,
                  // 入网权限
                  privilege: 1,
                  // 值守载波1
                  carrier1Id: 1,
                  // 值守载波2
                  carrier2Id: 0,
                  // 站能力
                  terminalProperty: 2,
                  // 值守分帧
                  stationGroup: 63,
                },
              ],
            },
            equipmentParamBean: {
              // lsStations 和 lsCuConfs 合并
              lsStations: [{
                stationSN: '123',
                modelName: '3.7米Ka／Ku双频段卫星通信综合车载站-军兵种型',
                stationName: '北京3.7米车',
                model: 1025,
              }],
              // 全局頻差参数 √
              globalParam: {
                // Ka/C下变频频差
                ka2C: 1400000000,
                // C/Ka上变频频差
                c2Ka: 950000000,
                // Ku/C下变频频差
                ku2C: 1400000000,
                // C/Ku下变频频差
                c2Ku: 950000000,
                // Ku/L下变频频差
                ku2L: 1400000000,
                // L/Ku上变频频差
                l2Ku: 950000000,
                // Ka/L下变频频差
                ka2L: 1400000000,
                // L/Ka上变频频差
                l2Ka: 950000000,
                c2L: 1400000000,
                l2C: 950000000,
                c2CDown: 1400000000,
                c2CUp: 950000000,
              },
              lsCuConfs: [{
                // 群号 搭配 lsGroupDefines 使用
                gno: 1,
                stationSn: '123',
                // 终端地址
                terminalAddr: 1,
                // 终端序列号
                terminalSerialNum: 1123,
                terminalType: 12,
                terminalTypeName: '二代TDMA终端',
                ipAddress: '1.12.1.13',
                terminalName: 'xxx部队通信终端1',
                terminalRole: 1,
                terminalRoleName: '主站',
              }],
              // 电话号码参数 √
              lsTermPhoneNums: [{
                // 终端地址
                terminalAddr: 12,
                phonePortID: 1,
                // 电话号码
                pNumber: '000001',
                shortNum: 1,
              }],
            },
            lsGroupDefines: [{
              groupNo: 1,
              groupName: '全网群',
            }],
          },
        },
        {
          // 版本名称
          confVersion: 123,
          // timeSpan 表示该配置的下发和被替换时间
          name: '2012-01-02 08:03:12 至 2012-01-02 08:03:12',
          // todo 配置状态 待开网、已下发、执行中、已终止
          confStatus: '已下发',
          // todo 配置文件类型
          configFileType: 'xxx',
          // todo 配置生成时间
          configurationGenerationTime: '2019-6-21 10:57:06',
          data: {
            taskInfo: {
              satID: 5,
              satName: '哈哈',
              // 业务量满足情况比例 [0-100]
              efficiency: 100,
              ucode: 12,
              // 用户单位
              userName: '家',
              startDate: '2019-01-02 09:00:00',
              endDate: '2019-03-02 09:00:00',
            },
            nccInfo: {
              nccId: 1,
              nccName: '北京网控中心',
              ip: '10.65.39.124:2000',
              // 网控中心角色
              role: 1,
            },
            netParamBean: {
              netParam: {
                // tdma 组网模式 网状网 星状网
                networkType: 1,
                // 组网规模
                networkSize: 10,
                // 中频频段
                intermediateFreqBand: 1,
                // 信噪比门限（高）
                en_ThresholdHigh: 160,
                // 信噪比门限（中）
                en_ThresholdMiddle: 120,
                // 信噪比门限（低）
                en_ThresholdLow: 100,
                // 参考Eb/N0补偿因子
                en_Compensate: 0,
                // 主站终端能力 一主一备 一主多备
                multi_CCU_Enb: 0,
              },
              frameStruct: {
                // 帧长度
                frameLen: 11100,
                // 超帧长度
                superFrameLen: 1,
                // 参考时隙编号
                refTimeSlotId: 0,
                // 突发保护时间
                burstProtectTime: 200,
                // 基本数据时隙长度
                dataTimeSlotLength: 100,
                // 帧保护时间
                frameProtectTime: 200,
              },
              lsSubFrames: [{
                // 子帧标识
                'subFrameId': 1,
                // 波束号
                'beamNo': 1,
                'beamName': '波束1',
                // 基本时隙数
                ' basicSlotNum': 4,
                // 子帧号
                'SEQ_NO': 1,
              },
                {
                  // 子帧标识
                  'subFrameId': 2,
                  // 波束号
                  'beamNo': 2,
                  'beamName': '波束2',
                  // 基本时隙数
                  ' basicSlotNum': 4,
                  // 子帧号
                  'SEQ_NO': 2,
                },
              ],
              lsCarrierParams: [{
                // 载波数据唯一标识
                sid: 1,
                // 载波标识
                carrierId: 1,
                // 子帧标识
                subFrameId: 1,
                // 源波束号
                sourceBeamId: 2,
                sourceBeamName: '源波束',
                // 目的波束号
                desBeamId: 3,
                desBeamName: '目的波束',
                // 上行转发器号
                upTspdId: 11,
                upTspdName: '上行转发器',
                // 发送射频频率
                upFreq: 14110123,
                // 接收射频频率
                downFreq: 2132324,
                // 载波速率
                carrierSpeedBps: 2048000,
                // 编码方式
                codeType: 1,
                // 数据时隙因子
                dataTimeSlot: 2,
                // 参考载波标识
                refCarrierFlag: 1,
                // 是否是载波组，1：是；0：否
                isGroup: 1,
                // 扩频比一
                spreadFactor1: 1,
                // 扩频一的数量
                subCarrierNum1: 4,
                // 规划时的载波类型
                carrierType: 1,
                carrierTypeName: '参考载波',
              },
                {
                  // 载波数据唯一标识
                  sid: 2,
                  // 载波标识
                  carrierId: 2,
                  // 子帧标识
                  subFrameId: 1,
                  // 源波束号
                  sourceBeamId: 2,
                  sourceBeamName: '源波束',
                  // 目的波束号
                  desBeamId: 3,
                  desBeamName: '目的波束',
                  // 上行转发器号
                  upTspdId: 11,
                  upTspdName: '上行转发器',
                  // 发送射频频率
                  upFreq: 14111123,
                  // 接收射频频率
                  downFreq: 2134324,
                  // 载波速率
                  carrierSpeedBps: 2048000,
                  // 编码方式
                  codeType: 1,
                  // 数据时隙因子
                  dataTimeSlot: 2,
                  // 参考载波标识
                  refCarrierFlag: 1,
                  // 是否是载波组，1：是；0：否
                  isGroup: 1,
                  // 扩频比一
                  spreadFactor1: 1,
                  // 扩频一的数量
                  subCarrierNum1: 4,
                  // 规划时的载波类型
                  carrierType: 2,
                  carrierTypeName: '业务载波',
                },
              ],
              lsRefCarrierParams: [{
                carrierSid: 1,
              }],
              // 反向载波数据 只有当netType 为星状网时有效
              lsReverseCarrierParams: [{
                carrierSid: 1,
                // 反向载波组标识
                reversionCarrierGroupId: 1,
              }],
              lsTermCtrls: [{
                // 终端地址
                terminalAddr: 1,
                // 入网权限
                privilege: 1,
                // 值守载波1
                carrier1Id: 1,
                // 值守载波2
                carrier2Id: 0,
                // 站能力
                terminalProperty: 1,
                // 值守分帧
                stationGroup: 63,
              },
                {
                  // 终端地址
                  terminalAddr: 2,
                  // 入网权限
                  privilege: 1,
                  // 值守载波1
                  carrier1Id: 1,
                  // 值守载波2
                  carrier2Id: 0,
                  // 站能力
                  terminalProperty: 2,
                  // 值守分帧
                  stationGroup: 63,
                },
              ],
            },
            equipmentParamBean: {
              lsStations: [{
                stationSN: '123',
                modelName: '3.7米Ka／Ku双频段卫星通信综合车载站-军兵种型',
                stationName: '北京3.7米车',
                model: 1025,
              }],
              globalParam: {
                // Ka/C下变频频差
                ka2C: 1400000000,
                // C/Ka上变频频差
                c2Ka: 950000000,
                // Ku/C下变频频差
                ku2C: 1400000000,
                // C/Ku下变频频差
                c2Ku: 950000000,
                // Ku/L下变频频差
                ku2L: 1400000000,
                // L/Ku上变频频差
                l2Ku: 950000000,
                // Ka/L下变频频差
                ka2L: 1400000000,
                // L/Ka上变频频差
                l2Ka: 950000000,
                c2L: 1400000000,
                l2C: 950000000,
                c2CDown: 1400000000,
                c2CUp: 950000000,
              },
              lsCuConfs: [{
                // 群号
                gno: 1,
                stationSn: '123',
                // 终端地址
                terminalAddr: 1,
                // 终端序列号
                terminalSerialNum: 1123,
                terminalType: 12,
                terminalTypeName: '二代TDMA终端',
                ipAddress: '1.12.1.13',
                terminalName: 'xxx部队通信终端1',
                terminalRoleId: 1,
                terminalRoleName: '主站',
              }],
              lsTermPhoneNums: [{
                // 终端地址
                terminalAddr: 12,
                phonePortID: 1,
                // 电话号码
                pNumber: '000001',
                shortNum: 1,
              }],
            },
            lsGroupDefines: [{
              groupNo: 1,
              groupName: '全网群',
            }],
          },
        },
      ],
    });
  }
}
