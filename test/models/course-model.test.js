
classroomTest('Course Model', () => {

  var Course;

  beforeEach(inject((_Course_) => {
    Course = _Course_;
  }));

  describe('#invitationURL', () => {
    it('generate invitation link properly', () => {
      new Course({invitation: {code: '1234'}}).invitationLink().should.eq('http://laboratory.localmumuki.io/join/1234');
    });
  });

});
