
angular
  .module('classroom')
  .factory('Course', function (Domain) {

    class Course {

      constructor(course = {}) {
        _.defaults(this, course);
      }

      getName() {
        return _.isEmpty(this.period) ? this.getSlugName() : this.getFullName();
      }

      iconClass() {
        return 'fa fa-graduation-cap';
      }

      iconSetting() {
        return 'fa fa-cog';
      }

      static from(course) {
        return new Course(course);
      }

      getSlugName() {
        return this.slug.split('/').join(' - ');
      }

      getFullName() {
        return `${this.period} - ${this.code} - ${this.getShiftsString()} - ${this.getDaysString()}`;
      }

      getDaysString() {
        return _(this.days)
          .map((day) => _.take(day, 3).join(''))
          .join(', ');
      }

      getShiftsString() {
        return this.shifts.join(', ');
      }

      invitationExpired() {
        const now = moment();
        const expiration = moment(_.get(this, 'invitation.expiration_date', Date.now()));
        return now >= expiration;
      }

      invitationLink() {
        return Domain.invitationURL(this.invitation.code);
      }

    }

    return Course;

  })
