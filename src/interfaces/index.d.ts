interface INotification {
  content: {
    title: string;
    body: string;
    data: any;
  };
  trigger: {
    type: any;
    seconds: number;
  };
}
