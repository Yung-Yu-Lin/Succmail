SuccApp.controller('NoreadMsgCtrl', ['$scope', '$http', '$filter', 'MyFavCT', 'MyBoxCT', 'SubDetail', 'FavFactory', 'IsInsFactory', 'ColorFactory', 'getnord', 'GetListFinish', 'EditFinish', '$rootScope', 'SubjectEvent', 'getfav', 'RightSide', '$q', 'getmybox', 'DelSubjFactory', function ($scope, $http, $filter, MyFavCT, MyBoxCT, SubDetail, FavFactory, IsInsFactory, ColorFactory, getnord, GetListFinish, EditFinish, $rootScope, SubjectEvent, getfav, RightSide, $q, getmybox, DelSubjFactory)
{
    // #region �Ѽ�
    // click target
    var clickTarget = '';
    //�w�]������|���
    $scope.$parent.$parent.ShowLeftMenu = true;
    //UserID
    var UserID = "";
    //CompanyID
    var CompID = "";
    //UserName
    var UserName = "";
    // #endregion
    // #region ��s����Ѽ�
    function UpdateGlobalParam() {
        UserID = $scope.IndexData.CurrentUser.UserID;
        //���w��Filter Directive
        $scope.userid = UserID;
        CompID = $scope.IndexData.CurrentUser.CompID;
        //���w��Filter Directive
        $scope.compid = CompID;
        UserName = $scope.IndexData.CurrentUser.UserName;
    };
    // #endregion 
    UpdateGlobalParam();
    // #region �I�s������Ū�T���D�D�C��
    GetNoReadList();
    // #endregion
    // #region �����쭫�sŪ����Ū�T���C��
    getnord.onGetnoRdList($scope, function () {
        GetNoReadList();
    });
    // #endregion
    // #region ������Ū�T���C����
    function GetNoReadList()
    {
        getnord.GetNoReadList($scope.IndexData.CurrentUser.UserID, $scope.CurrentCompany.CompanyID)
        .then(function (result) {
            $scope.AllNordData = result.data;
                for (var i = 0; i < result.data.length; i++) {
                    switch (result.data[i].NoReadState) {
                        //��Ū�T���D�D�C��
                        case 0:
                            $scope.noReadData = result.data[i].Disc;
                            if (result.data[i].Disc.length <= 0)
                                $scope.MsgNum = 0;
                            else
                                $scope.MsgNum = $scope.IndexData.NoReadCount;

                            break;
                            //�wŪ�T���D�D�C��
                        case 1:
                            $scope.ReadData = result.data[i].Disc;
                            break;
                            //�ӽ��k�ɰT���D�D�C��
                        case 2:
                            $scope.ApplyData = result.data[i].Disc;
                            if (result.data[i].Disc.length <= 0)
                                $scope.ApplyNum = 0;
                            else {
                                $scope.ApplyNum = result.data[i].Disc[0].SubjNum;
                                $scope.MsgNum = $scope.IndexData.NoReadCount;
                            }
                            break;
                    }
                }
            //����D�D�C���q��
            GetListFinish.GetFinish();
        });
    }
    // #endregion
    // #region ��Ū�s����
    angular.element('.tab-content').on('mouseover', '.data-table-tr-noRead', function () {
        $(this).find('.glyphicon-new-window').css('visibility', 'visible');
    });
    angular.element('.tab-content').on('mouseout', '.data-table-tr-noRead', function () {
        $(this).find('.glyphicon-new-window').css('visibility', 'hidden');
    });
    // #endregion
    // #region �[�J�ڪ��T��
    $scope.AddMyMsg = function (DiscID, SubjectID, type) {
        var Disc = [];
        //type 0:��Ū 1:�wŪ 2:�ӽ��k��
        switch (type) {
            case 0:
                Disc = $filter('filter')($scope.noReadData, { DiscID: DiscID }, true)[0];
                break;
            case 1:
                Disc = $filter('filter')($scope.ReadData, { DiscID: DiscID }, true)[0];
                break;
            case 2:
                Disc = $filter('filter')($scope.ApplyData, { DiscID: DiscID }, true)[0];
                break;
        }
        $filter('filter')(Disc.SubjectList, { SubjectID: SubjectID }, true)[0].IsIns = true;
        SettingIsIns(CompID, UserID, SubjectID, true);
    }
    // #endregion
    // #region �����ڪ��T��
    $scope.RemoveMyMsg = function (DiscID, SubjectID, type) {
        var Disc = [];
        //type 0:��Ū 1:�wŪ 2:�ӽ��k��
        switch (type) {
            case 0:
                Disc = $filter('filter')($scope.noReadData, { DiscID: DiscID }, true)[0];
                break;
            case 1:
                Disc = $filter('filter')($scope.ReadData, { DiscID: DiscID }, true)[0];
                break;
            case 2:
                Disc = $filter('filter')($scope.ApplyData, { DiscID: DiscID }, true)[0];
                break;
        }
        $filter('filter')(Disc.SubjectList, { SubjectID: SubjectID }, true)[0].IsIns = false;
        SettingIsIns(CompID, UserID, SubjectID, false);
    }
    // #endregion
    // #region �[�J����
    $scope.AddFav = function (DiscID, SubjectID, type) {
        var Disc = [];
        //type 0:��Ū 1:�wŪ 2:�ӽ��k��
        switch (type) {
            case 0:
                Disc = $filter('filter')($scope.noReadData, { DiscID: DiscID }, true)[0];
                break;
            case 1:
                Disc = $filter('filter')($scope.ReadData, { DiscID: DiscID }, true)[0];
                break;
            case 2:
                Disc = $filter('filter')($scope.ApplyData, { DiscID: DiscID }, true)[0];
                break;
        }
        $filter('filter')(Disc.SubjectList, { SubjectID: SubjectID }, true)[0].IsFav = true;
        SettingFav(CompID, UserID, SubjectID, true);
    }
    // #endregion
    // #region ��������
    $scope.RemoveFav = function (DiscID, SubjectID, type) {
        var Disc = [];
        //type 0:��Ū 1:�wŪ 2:�ӽ��k��
        switch (type) {
            case 0:
                Disc = $filter('filter')($scope.noReadData, { DiscID: DiscID }, true)[0];
                break;
            case 1:
                Disc = $filter('filter')($scope.ReadData, { DiscID: DiscID }, true)[0];
                break;
            case 2:
                Disc = $filter('filter')($scope.ApplyData, { DiscID: DiscID }, true)[0];
                break;
        }
        $filter('filter')(Disc.SubjectList, { SubjectID: SubjectID }, true)[0].IsFav = false;
        SettingFav(CompID, UserID, SubjectID, false);
    }
    // #endregion
    // #region �]�w�ڪ�����
    function SettingFav(compid, userid, subjid, flag)
    {
        getfav.SettingFav(compid, userid, subjid, flag)
        .then(function (result)
        {
            MyFavCT.UpdateFavCT(result.data);
        });
    }
    // #endregion
    // #region ���s�D�D�i�}�k�����e
    $scope.ShowSubject = function (Type, DiscID, CompanyID, UserID, SubjectID)
    {
        UpdateGlobalParam();
        var ShowSubjTemplate = function () {
            var q = $q.defer();
            q.resolve(SubDetail.OpenSubDetail(DiscID, CompanyID, UserID, SubjectID, UserName, Type));
            return q.promise;
        }
        clickTarget = 'detail';
        // �]�w�ثe�Ҧb���Q�ײ�
        $scope.$parent.$parent.CurrentDiscussion = { discID: DiscID, discName: '' };
        if ($scope.$parent.$parent.detailMsgUrl == '') {
            $scope.$parent.$parent.detailMsgUrl = '/Subject/SubDetailTemplate';
        }
        //else
        //{
        //    clickTarget = '';
        //    subjectOpen.OpenSubjectDetailBlock();
        //}
        $scope.promise = ShowSubjTemplate();
        $scope.promise
        .then(function () {
            //�ǰe�ѼƦ�SubDetail Factory
            return RightSide.ShowSubject();
        });
    }
    // #endregion
    // #region ngInclude load complete
    $rootScope.$on('$includeContentLoaded', function (event) {
        if (clickTarget === 'create')
        {
            RightSide.OpenNewMsg();
        }
        else if (clickTarget === 'detail')
        {
            RightSide.ShowSubject();
        }
        clickTarget = '';
    });
    // #endregion
    // #region �]�w�ڪ��H�c
    function SettingIsIns(compid, userid, subjid, flag)
    {
        getmybox.SettingIsIns(compid, userid, subjid, flag)
        .then(function (result)
        {
            MyBoxCT.UpdateBoxCT(result.data);
        });
    }
    // #endregion
    // #region �D�D�Բӭ���sFav �P�B��s��Ū�T���C��
    FavFactory.onUpdateFav($scope, 0, function (Item) {
        var DiscID = Item.DiscID;
        var SubjID = Item.SubjID;
        var Flag = Item.Flag;
        var DiscData = $filter('filter')($scope.noReadData, { DiscID: DiscID }, true)[0];
        $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true)[0].IsFav = Flag;
    });
    // #endregion
    // #region �D�D�Բӭ���sFav �P�B��s�wŪ�T���C��
    FavFactory.onUpdateFav($scope, 4, function (Item) {
        var DiscID = Item.DiscID;
        var SubjID = Item.SubjID;
        var Flag = Item.Flag;
        var DiscData = $filter('filter')($scope.ReadData, { DiscID: DiscID }, true)[0];
        $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true)[0].IsFav = Flag;
    });
    // #endregion
    // #region �D�D�Բӭ���sFav �P�B��s�ӽ��k�ɰT���C��
    FavFactory.onUpdateFav($scope, 5, function (Item) {
        var DiscID = Item.DiscID;
        var SubjID = Item.SubjID;
        var Flag = Item.Flag;
        var DiscData = $filter('filter')($scope.ApplyData, { DiscID: DiscID }, true)[0];
        $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true)[0].IsFav = Flag;
    });
    // #endregion
    // #region �D�D�Բӭ���sIsIns �P�B��s��Ū�T���C��
    IsInsFactory.onUpdateIsIns($scope, 0, function (Item) {
        var DiscID = Item.DiscID;
        var SubjID = Item.SubjID;
        var Flag = Item.Flag;
        var DiscData = $filter('filter')($scope.noReadData, { DiscID: DiscID }, true)[0];
        $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true)[0].IsIns = Flag;
    });
    // #endregion
    // #region �D�D�Բӭ���sIsIns �P�B��s�wŪ�T���C��
    IsInsFactory.onUpdateIsIns($scope, 4, function (Item) {
        var DiscID = Item.DiscID;
        var SubjID = Item.SubjID;
        var Flag = Item.Flag;
        var DiscData = $filter('filter')($scope.ReadData, { DiscID: DiscID }, true)[0];
        $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true)[0].IsIns = Flag;
    });
    // #endregion
    // #region �D�D�Բӭ���sIsIns �P�B��s�ӽ��k�ɰT���C��
    IsInsFactory.onUpdateIsIns($scope, 5, function (Item) {
        var DiscID = Item.DiscID;
        var SubjID = Item.SubjID;
        var Flag = Item.Flag;
        var DiscData = $filter('filter')($scope.ApplyData, { DiscID: DiscID }, true)[0];
        $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true)[0].IsIns = Flag;
    });
    // #endregion
    // #region �D�D�Բӭ���sColor �P�B��s��Ū�T���C��
    ColorFactory.onUpdateColor($scope, 0, function (Item) {
        var DiscID = Item.DiscID;
        var SubjID = Item.SubjID;
        var Color = Item.Color;
        var DiscData = $filter('filter')($scope.noReadData, { DiscID: DiscID }, true)[0];
        $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true)[0].SubjectColor = Color;
    });
    // #endregion
    // #region �D�D�Բӭ���sColor �P�B��s�wŪ�T���C��
    ColorFactory.onUpdateColor($scope, 4, function (Item) {
        var DiscID = Item.DiscID;
        var SubjID = Item.SubjID;
        var Color = Item.Color;
        var DiscData = $filter('filter')($scope.ReadData, { DiscID: DiscID }, true)[0];
        $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true)[0].SubjectColor = Color;
    });
    // #endregion
    // #region �D�D�Բӭ���sColor �P�B��s�ӽ��k�ɰT���C��
    ColorFactory.onUpdateColor($scope, 5, function (Item) {
        var DiscID = Item.DiscID;
        var SubjID = Item.SubjID;
        var Color = Item.Color;
        var DiscData = $filter('filter')($scope.ApplyData, { DiscID: DiscID }, true)[0];
        $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true)[0].SubjectColor = Color;
    });
    // #endregion
    // #region  �D�D�Բӭ��R���D�D�A�P�B��s��Ū�T���C��
    DelSubjFactory.onAfterDelSubj($scope, 0, function (Item)
    {
        var DiscID = Item.DiscID;
        var SubjID = Item.SubjID;
        var DiscData = $filter('filter')($scope.noReadData, { DiscID: DiscID }, true)[0];
        var subjItem = $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true);
        var subjIndex = DiscData.SubjectList.indexOf(subjItem[0]);
        if(subjIndex > -1)
        {
            DiscData.SubjectList.splice(subjIndex, 1);
        }
        RightSide.DeleteSubjDetailBlock($scope.$parent.$parent);
    });
    // #endregion
    // #region  �D�D�Բӭ��R���D�D�A�P�B��s�wŪ�T���C��
    DelSubjFactory.onAfterDelSubj($scope, 4, function (Item) {
        var DiscID = Item.DiscID;
        var SubjID = Item.SubjID;
        var DiscData = $filter('filter')($scope.ReadData, { DiscID: DiscID }, true)[0];
        var subjItem = $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true);
        var subjIndex = DiscData.SubjectList.indexOf(subjItem[0]);
        if (subjIndex > -1) {
            DiscData.SubjectList.splice(subjIndex, 1);
        }
        RightSide.DeleteSubjDetailBlock($scope.$parent.$parent);
    });
    // #endregion
    // #region  �D�D�Բӭ��R���D�D�A�P�B��s�ӽ��k�ɰT���C��
    DelSubjFactory.onAfterDelSubj($scope, 5, function (Item) {
        var DiscID = Item.DiscID;
        var SubjID = Item.SubjID;
        var DiscData = $filter('filter')($scope.ApplyData, { DiscID: DiscID }, true)[0];
        var subjItem = $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true);
        var subjIndex = DiscData.SubjectList.indexOf(subjItem[0]);
        if (subjIndex > -1) {
            DiscData.SubjectList.splice(subjIndex, 1);
        }
        RightSide.DeleteSubjDetailBlock($scope.$parent.$parent);
    });
    // #endregion
    // #region ��ť��s�觹���A��s��Ū�T���C��
    EditFinish.onEditSubj($scope, 0, function (Data)
    {
        var DiscData = $filter('filter')($scope.noReadData, { DiscID: Data.DiscID }, true)[0];

        if (Data.Type == 0)
        {
            //��s�D�D�C��D�D
            $filter('filter')(DiscData.SubjectList, { SubjectID: Data.SubjID }, true)[0].SubjectTitle = Data.Title;
            //��s�D�D�C����H
            $filter('filter')(DiscData.SubjectList, { SubjectID: Data.SubjID }, true)[0].Receiver = Data.Receiver;
            //��s�D�D�C��w�w��������ɶ�
            $filter('filter')(DiscData.SubjectList, { SubjectID: Data.SubjID }, true)[0].PlanDiff = CalculatePlanDiff(Data.PlanDate);
        }
        //��s�D�D�C��̫�^�ФH
        $filter('filter')(DiscData.SubjectList, { SubjectID: Data.SubjID }, true)[0].ModifiedBy = Data.ModifiedBy;
        //��s�D�D�C��̫�^�ФH�W��
        $filter('filter')(DiscData.SubjectList, { SubjectID: Data.SubjID }, true)[0].ModifierName = Data.ModifierName;
        //��s�D�D�C��̫�^�ФH�ɶ�
        $filter('filter')(DiscData.SubjectList, { SubjectID: Data.SubjID }, true)[0].ModifiedOn = Data.ModifiedOn;
    });
    // #endregion
    // #region ��ť��s�觹���A��s�wŪ�T���C��
    EditFinish.onEditSubj($scope, 4, function (Data)
    {    
        var DiscData = $filter('filter')($scope.ReadData, { DiscID: Data.DiscID }, true)[0];

        if (Data.Type == 0)
        {
            //��s�D�D�C��D�D
            $filter('filter')(DiscData.SubjectList, { SubjectID: Data.SubjID }, true)[0].SubjectTitle = Data.Title;
            //��s�D�D�C����H
            $filter('filter')(DiscData.SubjectList, { SubjectID: Data.SubjID }, true)[0].Receiver = Data.Receiver;
            //��s�D�D�C��w�w��������ɶ�
            $filter('filter')(DiscData.SubjectList, { SubjectID: Data.SubjID }, true)[0].PlanDiff = CalculatePlanDiff(Data.PlanDate);
        }
        //��s�D�D�C��̫�^�ФH
        $filter('filter')(DiscData.SubjectList, { SubjectID: Data.SubjID }, true)[0].ModifiedBy = Data.ModifiedBy;
        //��s�D�D�C��̫�^�ФH�W��
        $filter('filter')(DiscData.SubjectList, { SubjectID: Data.SubjID }, true)[0].ModifierName = Data.ModifierName;
        //��s�D�D�C��̫�^�ФH�ɶ�
        $filter('filter')(DiscData.SubjectList, { SubjectID: Data.SubjID }, true)[0].ModifiedOn = Data.ModifiedOn;
    });
    // #endregion
    // #region ��ť��s�觹���A��s�ӽ��k�ɰT���C��
    EditFinish.onEditSubj($scope, 5, function (Data)
    {
        var DiscData = $filter('filter')($scope.ApplyData, { DiscID: Data.DiscID }, true)[0];

        if (Data.Type)
        {
            //��s�D�D�C��D�D
            $filter('filter')(DiscData.SubjectList, { SubjectID: Data.SubjID }, true)[0].SubjectTitle = Data.Title;
            //��s�D�D�C����H
            $filter('filter')(DiscData.SubjectList, { SubjectID: Data.SubjID }, true)[0].Receiver = Data.Receiver;
            //��s�D�D�C��w�w��������ɶ�
            $filter('filter')(DiscData.SubjectList, { SubjectID: Data.SubjID }, true)[0].PlanDiff = CalculatePlanDiff(Data.PlanDate);
        }
        //��s�D�D�C��̫�^�ФH
        $filter('filter')(DiscData.SubjectList, { SubjectID: Data.SubjID }, true)[0].ModifiedBy = Data.ModifiedBy;
        //��s�D�D�C��̫�^�ФH�W��
        $filter('filter')(DiscData.SubjectList, { SubjectID: Data.SubjID }, true)[0].ModifierName = Data.ModifierName;
        //��s�D�D�C��̫�^�ФH�ɶ�
        $filter('filter')(DiscData.SubjectList, { SubjectID: Data.SubjID }, true)[0].ModifiedOn = Data.ModifiedOn;
    });
    // #endregion
    // #region �p�⧹������t�Z
    function CalculatePlanDiff(para) {

        var Today = Date.parse(new Date()) / 1000;
        var dayDifference = Math.round((para - Today) / 60 / 60 / 24);
        //�W�V99 ���99+
        if (Math.abs(dayDifference) > 99)
            return "99+";
        else
            return Math.abs(dayDifference);
    };
    // #endregion
    // #region �D�D�Բӭ����A��s�A�P�B��s��Ū�T���C��
    SubDetail.onUpdateSubjectProgress(0, function (Item)
    {
        var DiscID = Item.DiscID;
        var SubjID = Item.SubjId;
        var State = Item.State;
        var DiscData = $filter('filter')($scope.noReadData, { DiscID: DiscID }, true)[0];
        $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true)[0].Progress = State;
    });
    // #endregion
    // #region �D�D�Բӭ����A��s�A�P�B��s�wŪ�T���C��
    SubDetail.onUpdateSubjectProgress(4, function (Item) {
        var DiscID = Item.DiscID;
        var SubjID = Item.SubjId;
        var State = Item.State;
        var DiscData = $filter('filter')($scope.ReadData, { DiscID: DiscID }, true)[0];
        $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true)[0].Progress = State;
    });
    // #endregion
    // #region �D�D�Բӭ����A��s�A�P�B��s�ӽ��k�ɰT���C��
    SubDetail.onUpdateSubjectProgress(5, function (Item) {
        var DiscID = Item.DiscID;
        var SubjID = Item.SubjId;
        var State = Item.State;
        var DiscData = $filter('filter')($scope.ApplyData, { DiscID: DiscID }, true)[0];
        $filter('filter')(DiscData.SubjectList, { SubjectID: SubjID }, true)[0].Progress = State;
    });
    // #endregion
    // #region �D�D�Բӭ���ť==��s�wŪ��==���ƥ�
    SubDetail.onUpdateReadState(function (Item)
    {
        var SubjID = Item.SubjID;
        var DiscID = Item.DiscID;
        // #region  �]���wŪ
        var discItem = $filter('filter')($scope.noReadData, { DiscID: DiscID }, true)[0];
        if (typeof discItem !== 'undefined')
        {
            var subItem = $filter('filter')(discItem.SubjectList, { SubjectID: SubjID })[0];
            if (typeof subItem !== 'undefined')
            {
                subItem.IsRead = true;
            }
        }
        // #endregion
        // #region  ��s�W��Ʀr
        $scope.MsgNum = $scope.IndexData.NoReadCount;
        // #endregion
    });
    // #endregion
    // #region ��ť��ReplyCtrl ReplyInserted�s���Ӫ��ƥ�
    $rootScope.$on(SubjectEvent.ReplyInserted, function (event, data) {
        var SubjID = data.SubjId;
        var DiscID = data.DiscID;
        // �q����HŪ������,�S���A�h�ӽ��k�ɧ�
        var discItem = $filter('filter')($scope.ReadData, { DiscID: DiscID }, true)[0];
        if (typeof discItem === 'undefined') {
            discItem = $filter('filter')($scope.ApplyData, { DiscID: DiscID }, true)[0];
        }
        if (typeof discItem !== 'undefined') {
            var CurrentSubject = $filter('filter')(discItem.SubjectList, { SubjectID: SubjID }, true)[0];
            if (typeof CurrentSubject !== 'undefined') {
                CurrentSubject.ModifiedOn = data.CreateOn;
                CurrentSubject.ModifierName = data.CreatedName;
                CurrentSubject.ReplyCount = CurrentSubject.ReplyCount + 1;
            }
        }
    });
    // #endregion
    // #region �ഫ�w�p�������
    $scope.ConvertPlanDiff = function (_PlanCloseOn, _Progress, _Type) {
        // Type 0: �w�W�L����, 1:�|���W�L����
        if (_PlanCloseOn == 0) {
            return "";
        }
        else {
            var _result = ListCalculatePlanDiff(_PlanCloseOn, _Progress, _Type);
            return _result;
        }
    };
    // #endregion
    // #region �C��p�����t�Z
    function ListCalculatePlanDiff(para1, para2, para3) {
        var Today = Date.parse(new Date()) / 1000;
        var dayDifference = 0;
        if (para2 >= 9) {
            dayDifference = 0;
        }
        else {
            dayDifference = Math.round((para1 - Today) / 60 / 60 / 24);
        }
        //�W�V99 ���99+
        if (Math.abs(dayDifference) > 99)
            return "99+";
        else {
            var _result = para3 == 1 ? Math.abs(dayDifference) : dayDifference;
            return _result;
        }

    }
    // #endregion
}]);