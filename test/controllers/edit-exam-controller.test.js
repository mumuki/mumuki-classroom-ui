
classroomTest('Edit Exam Controller', () => {

  const date = moment().toDate();

  let $scope;
  let $state;
  let students;

  beforeEach(inject((_$rootScope_, _$controller_) => {
    $scope = _$rootScope_.$new();
    students = [{ uid: 0 }, { uid: 1 }, { uid: 2 }];
    $state = { params: {course: 'foo' } }
    const exam = {
      id: '0123456789abcdef',
      start_time: date,
      end_time: date,
      duration: 60,
      slug: 'mumuki/mumuki-guia-funcional',
      name: 'mumuki guia funcional',
      language: 'haskell',
      uids: [1]
    };
    _$controller_('EditExamController', { $scope, students: {students}, exam, $state });
  }));

  describe('#getExam', () => {
    let e;

    beforeEach(() => e = $scope.getExam());

    it('should has correct id', () => e.id.should.be.eql('0123456789abcdef'));
    it('should has correct slug', () => e.slug.should.be.eql('mumuki/mumuki-guia-funcional'));
    it('should has correct name', () => e.name.should.be.eql('mumuki guia funcional'));
    it('should has correct duration', () => e.duration.should.be.eql(60));
    it('should has correct end_time', () => e.end_time.should.be.eql(date));
    it('should has correct language', () => e.language.should.be.eql('haskell'));
    it('should has correct start_time', () => e.start_time.should.be.eql(date));
    it('should has correct uids', () => e.uids.should.be.eql([1]));
  });

  describe('#toggle', () => {

    var myPromise = (value) => ({
      then: (callback) => myPromise(callback(value))
    })

    beforeEach(inject((Api) => {
      Api.addStudentToExam    = myPromise;
      Api.removeStudentToExam = myPromise;
    }));

    it('student is selected', () => {
      const student = students[0];
      student.isSelected = false;
      $scope
        .toggle(student)
        .then(() => student.isSelected.should.be.eql(true));
    });
    it('student is unselected', () => {
      const student = students[0];
      student.isSelected = true;
      $scope
        .toggle(student)
        .then(() => student.isSelected.should.be.eql(false));
    });
  });

});
